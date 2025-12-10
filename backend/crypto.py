"""Simple crypto helpers for the backend.

Provides Caesar cipher `encrypt_message` and `decrypt_message` functions.
"""

from typing import Any


def encrypt_message(message: str, key: int) -> str:
    """Encrypt message using Caesar cipher with integer key.

    Non-letter characters are left unchanged.
    """
    if not isinstance(key, int):
        raise TypeError("Key must be an integer for Caesar cipher")
    result_chars = []
    for ch in message:
        if 'A' <= ch <= 'Z':
            shifted = chr((ord(ch) - 65 + key) % 26 + 65)
            result_chars.append(shifted)
        elif 'a' <= ch <= 'z':
            shifted = chr((ord(ch) - 97 + key) % 26 + 97)
            result_chars.append(shifted)
        else:
            result_chars.append(ch)
    return ''.join(result_chars)


def decrypt_message(message: str, key: int) -> str:
    """Decrypt Caesar-encrypted message with integer key."""
    return encrypt_message(message, (-key) % 26)
