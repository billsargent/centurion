# Disk Images

The boot disk images are **not** committed to git — they are large binary
files (Hawk/Finch formats) and are ignored via the root `.gitignore`.

Restore them from a backup or the original source to run the emulator:

| File           | Size      | Kind          | Notes                          |
|----------------|-----------|---------------|--------------------------------|
| `CENTOS_12.IMG`| 6,651,904 | Hawk (stride 512) | Boots CENTOS (DOS 7.1)     |
| `CENTOS_13.IMG`| 6,651,904 | Hawk (stride 512) | Boots CENTOS (DOS 7.1-E)   |
| `FINCH2.BIN`   | 30,469,061| Finch          | Optional data disk             |
| `TORI.FFI`     | 32,524,800| Finch (512)    | Optional data disk             |

The server auto-mounts `CENTOS_13.IMG` (stride 512, sense = S2+S4 = 10).
