"""
AI Provider Abstraction.

Supports multiple LLM providers with minimal code changes.
Current: Gemini (default, new google.genai SDK v2.x), OpenAI (fallback)
"""
import os
import json
import traceback
from abc import ABC, abstractmethod
from typing import Optional


class AIProvider(ABC):
    """Abstract base class for AI providers."""

    @abstractmethod
    def chat(self, messages: list, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Send a chat completion request and return the response text."""
        pass

    @abstractmethod
    def get_provider_name(self) -> str:
        """Return the provider name for logging/storage."""
        pass


class GeminiProvider(AIProvider):
    """
    Google Gemini provider using the new google.genai SDK (v2.x).
    
    The old google.generativeai SDK (v0.8.x) is deprecated and no longer supported.
    This implementation uses the new google.genai package.
    """

    # Stable, widely-available models (free tier) as of mid-2026.
    # NOTE: gemini-2.5-flash and gemini-2.5-flash-lite are no longer
    # available to new users.  Use gemini-3.5-flash-lite or newer.
    _DEFAULT_MODEL = "gemini-3.5-flash-lite"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY", "")
        self.model = model or self._DEFAULT_MODEL

    def chat(self, messages: list, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Send chat completion via the new Google Gemini SDK (google.genai)."""
        if not self.api_key:
            error_msg = (
                "Gemini API key is not configured. "
                "Set GEMINI_API_KEY in your .env file."
            )
            print(f"[GeminiProvider] ERROR: {error_msg}")
            raise ValueError(error_msg)

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self.api_key)

            # --- Extract system instruction & build content list ----------
            system_instruction = None
            content_messages: list[types.Content] = []

            for m in messages:
                role = m.get("role", "user")
                content = m.get("content", "")

                if role == "system":
                    system_instruction = content
                else:
                    # Map "assistant" -> "model" for Gemini
                    gemini_role = "model" if role == "assistant" else "user"
                    content_messages.append(
                        types.Content(
                            role=gemini_role,
                            parts=[types.Part(text=content)],
                        )
                    )

            # Build generation config
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=temperature,
                max_output_tokens=max_tokens,
            )

            # --- Single-turn vs multi-turn --------------------------------
            if len(content_messages) <= 1:
                # Simple single-turn request
                user_text = content_messages[-1].parts[0].text if content_messages else ""
                response = client.models.generate_content(
                    model=self.model,
                    contents=user_text,
                    config=config,
                )
                return response.text.strip()

            else:
                # Multi-turn chat with history
                history = content_messages[:-1]
                current_message = content_messages[-1]

                chat = client.chats.create(
                    model=self.model,
                    config=config,
                    history=history,
                )
                response = chat.send_message(current_message.parts[0].text)
                return response.text.strip()

        except Exception as e:
            # Log the FULL exception (traceback) to the backend console
            # so we never silently swallow errors.
            print("=" * 70)
            print(f"[GeminiProvider] ERROR (model={self.model}):")
            traceback.print_exc()
            print("=" * 70)
            # Re-raise so the caller (e.g. the API route) can handle the
            # error appropriately instead of getting a fake "helpful" reply.
            raise

    def get_provider_name(self) -> str:
        return f"gemini/{self.model}"


class OpenAIProvider(AIProvider):
    """OpenAI GPT provider."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.environ.get("OPENAI_API_KEY", "")
        self.model = model

    def chat(self, messages: list, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """Send chat completion via OpenAI."""
        if not self.api_key:
            error_msg = (
                "OpenAI API key is not configured. "
                "Set OPENAI_API_KEY in your .env file."
            )
            print(f"[OpenAIProvider] ERROR: {error_msg}")
            raise ValueError(error_msg)

        try:
            from openai import OpenAI as OpenAIClient

            client = OpenAIClient(api_key=self.api_key)
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print("=" * 70)
            print(f"[OpenAIProvider] ERROR (model={self.model}):")
            traceback.print_exc()
            print("=" * 70)
            raise

    def get_provider_name(self) -> str:
        return f"openai/{self.model}"


class ClaudeProvider(AIProvider):
    """Anthropic Claude provider (future integration)."""

    def __init__(self, api_key: Optional[str] = None, model: str = "claude-3-haiku-20240307"):
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY", "")
        self.model = model

    def chat(self, messages: list, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        return "Claude integration coming soon. Please configure your ANTHROPIC_API_KEY."

    def get_provider_name(self) -> str:
        return f"claude/{self.model}"


def get_provider(provider_name: str = "gemini") -> AIProvider:
    """Factory function to get the appropriate AI provider."""
    providers = {
        "openai": OpenAIProvider,
        "gemini": GeminiProvider,
        "claude": ClaudeProvider,
    }
    provider_class = providers.get(provider_name.lower(), GeminiProvider)
    return provider_class()