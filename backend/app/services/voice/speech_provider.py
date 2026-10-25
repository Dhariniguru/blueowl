"""
Speech Provider Abstraction Layer
==================================

This module defines the abstract interface for speech-to-text providers
and the default implementation using the browser's Web Speech API.

To add a new provider (e.g., OpenAI Whisper, Azure Speech Services):
1. Create a new class that implements SpeechProvider
2. Implement the transcribe() method
3. Register it in the provider factory

No business logic should depend directly on a concrete provider.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class TranscriptionResult:
    """Standardised transcript returned by any speech provider."""
    text: str
    confidence: Optional[float] = None
    duration_seconds: Optional[float] = None
    provider: str = "web_speech_api"
    raw_response: Optional[dict] = None


class SpeechProvider(ABC):
    """
    Abstract base class for all speech-to-text providers.
    Every provider must implement the transcribe method.

    The rest of the application depends ONLY on this abstraction.
    """

    @abstractmethod
    def transcribe(self, audio_data: bytes, language: str = "en-US") -> TranscriptionResult:
        """
        Transcribe audio data to text.

        Args:
            audio_data: Raw audio bytes (format depends on provider)
            language: Language code (e.g., "en-US", "es-ES")

        Returns:
            TranscriptionResult with the transcribed text and metadata
        """
        ...

    @abstractmethod
    def validate_audio(self, audio_data: bytes) -> bool:
        """
        Validate that the audio data is usable by this provider.

        Args:
            audio_data: Raw audio bytes

        Returns:
            True if the audio can be processed, False otherwise
        """
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider identifier (e.g., 'whisper', 'azure')."""
        ...


class WebSpeechProvider(SpeechProvider):
    """
    Placeholder provider for browser-based Web Speech API.

    When the browser handles speech recognition via
    window.SpeechRecognition, the transcript is sent directly as a string.
    This provider exists to maintain consistent architecture — the
    transcription already happened on the client; this just wraps it.

    This provider name is stored in the database so we can always tell
    which provider generated a transcript.
    """

    @property
    def provider_name(self) -> str:
        return "web_speech_api"

    def transcribe(self, audio_data: bytes, language: str = "en-US") -> TranscriptionResult:
        """
        For WebSpeechProvider, the transcript is sent as UTF-8 encoded text
        rather than raw audio. This method decodes it back.
        """
        text = audio_data.decode("utf-8").strip()
        return TranscriptionResult(
            text=text,
            confidence=1.0,
            provider=self.provider_name,
        )

    def validate_audio(self, audio_data: bytes) -> bool:
        try:
            text = audio_data.decode("utf-8").strip()
            return len(text) > 0
        except UnicodeDecodeError:
            return False


class SpeechProviderFactory:
    """
    Factory for creating speech provider instances.
    New providers are registered here.
    """

    _providers: dict[str, type[SpeechProvider]] = {
        "web_speech_api": WebSpeechProvider,
        # Future providers register here:
        # "whisper": WhisperProvider,
        # "azure": AzureSpeechProvider,
        # "google": GoogleSpeechProvider,
        # "deepgram": DeepgramProvider,
    }

    @classmethod
    def register_provider(cls, name: str, provider_cls: type[SpeechProvider]) -> None:
        """Register a new provider at runtime."""
        cls._providers[name] = provider_cls

    @classmethod
    def get_provider(cls, name: str = "web_speech_api") -> SpeechProvider:
        """
        Get a provider instance by name.

        Args:
            name: Provider identifier (defaults to web_speech_api)

        Returns:
            An instance of the requested SpeechProvider

        Raises:
            ValueError: If the provider name is not registered
        """
        provider_cls = cls._providers.get(name)
        if not provider_cls:
            raise ValueError(
                f"Unknown provider '{name}'. "
                f"Available providers: {list(cls._providers.keys())}"
            )
        return provider_cls()