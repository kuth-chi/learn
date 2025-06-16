

using System.Security.Cryptography;
using System.Text;

namespace DataTransitions.Services;

public class EncryptionService
{
    private readonly byte[] _key;

    public EncryptionService(IConfiguration configuration)
    {
        string? keyHex = configuration["EncryptionKey"];
        if (string.IsNullOrWhiteSpace(keyHex))
            throw new Exception("EncrytionKey is not configured.");

        _key = HexStringToByteArray(keyHex) ?? throw new Exception("Failed to convert EncryptionKey to byte array.");

        if (_key.Length != 32)
            throw new Exception("EncryptionKey must be 32 bytes (64 hex characters).");
    }

    
    public string Encrypt(string plainText)
    {
        using Aes aes = Aes.Create();
        aes.Key = _key;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;

        // Generate a random IV
        aes.GenerateIV();
        byte[] iv = aes.IV;

        using var encryptor = aes.CreateEncryptor(aes.Key, iv);
        byte[] plainBytes = Encoding.UTF8.GetBytes(plainText);
        byte[] encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);

        return $"{ByteArrayToHex(iv)}: {ByteArrayToHex(encryptedBytes)}";
        
    }

    public string Decrypt(string cipherTextWithIv)
    {
        if(string.IsNullOrWhiteSpace(cipherTextWithIv))
            return string.Empty ;

        string[] parts = cipherTextWithIv.Split(':');
        if (parts.Length != 2)
            throw new FormatException("Invalid ciphertext format. Expected 'IV_HEX:CIPHERTEXT_HEX'.");

        // Convert hex strings back to byte arrays:
        byte[]? iv = HexStringToByteArray(parts[0].Trim());
        byte[]? encryptedBytes = HexStringToByteArray(parts[1].Trim());

        if (iv == null || encryptedBytes == null)
            throw new FormatException("Failed to convert hex string parts to byte arrays during decryption.");

        using Aes aes = Aes.Create();
        aes.Key = _key;
        aes.Mode = CipherMode.CBC;
        aes.Padding = PaddingMode.PKCS7;
        aes.IV = iv;

        // Create a decryptor with the key and IV. 
        using var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        try
        {
            // Perform the decryption
            byte[] plainBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
            
            // Convert the decrypted bytes back to a UTF-8 string
            return Encoding.UTF8.GetString(plainBytes);
        }
        catch (CryptographicException ex)
        {
            Console.WriteLine($"Decryption failed: {ex.Message}");
            throw new CryptographicException("Decryption failed. Data may be corrupted or key/IV is incorrect.", ex);
        }
    }

    private byte[]? HexStringToByteArray(string hex)
    {
        int numberChars = hex.Length;
        byte[] bytes = new byte[numberChars / 2];
        for (int i = 0; i < numberChars; i += 2)
            bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
        return bytes;
    }

    // helper: convert a byte to a hex string
    private string ByteArrayToHex(byte[] bytes)
    {
        StringBuilder hex = new StringBuilder(bytes.Length * 2);
        foreach (var b in bytes)
            hex.AppendFormat("{0:x2}", b);

        return hex.ToString();
    }


}
