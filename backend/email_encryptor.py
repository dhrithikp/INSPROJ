#!/usr/bin/env python3
"""
Email Encryptor (CLI + Tkinter GUI)

Features:
- `encrypt_message(message, key)` and `decrypt_message(message, key)` using Caesar cipher
- CLI menu: Encrypt / Decrypt / Exit
- Tkinter GUI: large input Text, key Entry, method dropdown (Caesar), Encrypt/Decrypt buttons, output Text

Run: `python3 email_encryptor.py` and choose CLI or GUI when prompted.
"""

import sys
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext


def encrypt_message(message: str, key: int) -> str:
    """Encrypts the message using a Caesar cipher with integer `key`.

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
    """Decrypts a Caesar-encrypted message with integer `key`."""
    return encrypt_message(message, (-key) % 26)


def run_cli():
    print("Simple Email Encryptor (CLI) - Caesar Cipher")
    while True:
        print("\nMenu:")
        print("  1) Encrypt")
        print("  2) Decrypt")
        print("  3) Exit")
        choice = input("Choose an option (1-3): ").strip()
        if choice == '3' or choice.lower() == 'exit':
            print("Exiting.")
            break
        if choice not in ('1', '2'):
            print("Invalid choice. Try again.")
            continue

        print("Enter the (multi-line) email message. End input with a single line containing only '.'")
        lines = []
        while True:
            line = input()
            if line == '.':
                break
            lines.append(line)
        message = '\n'.join(lines)

        key_input = input("Enter integer key (0-25): ").strip()
        try:
            key = int(key_input) % 26
        except ValueError:
            print("Key must be an integer. Operation cancelled.")
            continue

        if choice == '1':
            out = encrypt_message(message, key)
            print("\n--- Encrypted Message ---")
            print(out)
            print("--- End ---\n")
        else:
            out = decrypt_message(message, key)
            print("\n--- Decrypted Message ---")
            print(out)
            print("--- End ---\n")


class EmailEncryptorGUI(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Email Encryptor - Caesar Cipher")
        self.geometry("900x600")
        self.resizable(True, True)

        main_frame = ttk.Frame(self, padding=12)
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Input label and text
        ttk.Label(main_frame, text="Input Email Message:").grid(row=0, column=0, sticky=tk.W)
        self.input_text = scrolledtext.ScrolledText(main_frame, wrap=tk.WORD, height=12)
        self.input_text.grid(row=1, column=0, columnspan=3, sticky="nsew", pady=(4, 12))

        # Key and method
        ttk.Label(main_frame, text="Encryption Key:").grid(row=2, column=0, sticky=tk.W)
        self.key_var = tk.StringVar()
        self.key_entry = ttk.Entry(main_frame, textvariable=self.key_var, width=20)
        self.key_entry.grid(row=3, column=0, sticky=tk.W)

        ttk.Label(main_frame, text="Method:").grid(row=2, column=1, sticky=tk.W, padx=(12, 0))
        self.method_var = tk.StringVar(value='Caesar')
        method_menu = ttk.OptionMenu(main_frame, self.method_var, 'Caesar', 'Caesar')
        method_menu.grid(row=3, column=1, sticky=tk.W, padx=(12, 0))

        # Buttons
        encrypt_btn = ttk.Button(main_frame, text="Encrypt Email", command=self.on_encrypt)
        encrypt_btn.grid(row=3, column=2, sticky=tk.E)

        decrypt_btn = ttk.Button(main_frame, text="Decrypt Email", command=self.on_decrypt)
        decrypt_btn.grid(row=3, column=3, sticky=tk.E, padx=(8, 0))

        # Output
        ttk.Label(main_frame, text="Output:").grid(row=4, column=0, sticky=tk.W, pady=(12, 0))
        self.output_text = scrolledtext.ScrolledText(main_frame, wrap=tk.WORD, height=12)
        self.output_text.grid(row=5, column=0, columnspan=4, sticky="nsew", pady=(4, 0))

        # Configure grid weights
        main_frame.columnconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=0)
        main_frame.columnconfigure(2, weight=0)
        main_frame.columnconfigure(3, weight=0)
        main_frame.rowconfigure(1, weight=1)
        main_frame.rowconfigure(5, weight=1)

        # Add padding around widgets
        for child in main_frame.winfo_children():
            child.grid_configure(padx=6, pady=6)

    def validate_key_caesar(self, key_str: str):
        if key_str.strip() == '':
            raise ValueError("Key is required for Caesar cipher")
        try:
            key = int(key_str)
        except ValueError:
            raise ValueError("Key must be an integer for Caesar cipher")
        if not (0 <= key <= 1000000):
            # allow large positive ints but normalize later
            raise ValueError("Key must be a non-negative integer")
        return key % 26

    def on_encrypt(self):
        method = self.method_var.get()
        message = self.input_text.get('1.0', tk.END).rstrip('\n')
        key_str = self.key_var.get()
        try:
            if method == 'Caesar':
                key = self.validate_key_caesar(key_str)
                out = encrypt_message(message, key)
            else:
                raise NotImplementedError(f"Method '{method}' not implemented")
        except Exception as e:
            messagebox.showerror("Error", str(e))
            return

        self.output_text.delete('1.0', tk.END)
        self.output_text.insert(tk.END, out)

    def on_decrypt(self):
        method = self.method_var.get()
        message = self.input_text.get('1.0', tk.END).rstrip('\n')
        key_str = self.key_var.get()
        try:
            if method == 'Caesar':
                key = self.validate_key_caesar(key_str)
                out = decrypt_message(message, key)
            else:
                raise NotImplementedError(f"Method '{method}' not implemented")
        except Exception as e:
            messagebox.showerror("Error", str(e))
            return

        self.output_text.delete('1.0', tk.END)
        self.output_text.insert(tk.END, out)


def main():
    # Ask whether the user wants CLI or GUI
    print("Email Encryptor - Choose mode:")
    print("  1) GUI (Tkinter)")
    print("  2) CLI (text menu)")
    mode = input("Select mode (1-2, default 1): ").strip() or '1'
    if mode == '2' or mode.lower() == 'cli':
        run_cli()
        return

    # Launch GUI
    try:
        app = EmailEncryptorGUI()
        app.mainloop()
    except tk.TclError as e:
        print("Failed to start GUI (Tkinter). Running CLI instead.")
        print("Error:", e)
        run_cli()


if __name__ == '__main__':
    main()
