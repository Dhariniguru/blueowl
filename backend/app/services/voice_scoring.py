"""
Voice Learning module.
-----------------------
Speech-to-text itself runs in the browser via the Web Speech API
(SpeechRecognition) — see frontend/src/hooks/useSpeech.js — because that
needs no API key and works fully offline-friendly for a student project.

This service takes the resulting transcript and target sentence and produces
a pronunciation/fluency score plus per-word feedback, using a Levenshtein-
based word alignment (a simplified word error rate, the same core metric
commercial pronunciation-assessment APIs report on).

Swap-in point: if you later get access to a cloud STT/pronunciation API
(Azure Pronunciation Assessment, Google Speech-to-Text), replace
`score_pronunciation` with a call to that provider and keep the same
return shape so nothing else has to change.
"""
import re


def _normalize(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s']", "", text)
    return text.split()


def _levenshtein_alignment(ref_words, hyp_words):
    """Classic DP word alignment, returns per-ref-word correct/incorrect flags."""
    n, m = len(ref_words), len(hyp_words)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if ref_words[i - 1] == hyp_words[j - 1] else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,      # deletion
                dp[i][j - 1] + 1,      # insertion
                dp[i - 1][j - 1] + cost,  # substitution / match
            )

    # backtrack to find which ref words matched
    i, j = n, m
    matched = [False] * n
    while i > 0 and j > 0:
        if ref_words[i - 1] == hyp_words[j - 1]:
            matched[i - 1] = True
            i, j = i - 1, j - 1
        elif dp[i][j] == dp[i - 1][j - 1] + 1:
            i, j = i - 1, j - 1  # substitution
        elif dp[i][j] == dp[i - 1][j] + 1:
            i -= 1  # deletion (ref word missing from speech)
        else:
            j -= 1  # insertion (extra word spoken)

    return dp[n][m], matched


def score_pronunciation(target_text: str, transcript: str):
    ref_words = _normalize(target_text)
    hyp_words = _normalize(transcript)

    if not ref_words:
        return 0.0, []

    edit_distance, matched = _levenshtein_alignment(ref_words, hyp_words)
    word_error_rate = edit_distance / len(ref_words)
    accuracy = max(0.0, 1 - word_error_rate)
    score = round(accuracy * 100, 1)

    word_feedback = [
        {"word": ref_words[idx], "correct": matched[idx]} for idx in range(len(ref_words))
    ]
    return score, word_feedback
