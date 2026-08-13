# Disk Images

The boot disk images are **committed** to this repo so a clone is
self-contained and boots out of the box (Hawk/Finch formats; stride is
auto-detected from file size by the server and browser):

| File           | Size      | Kind          | Notes                          |
|----------------|-----------|---------------|--------------------------------|
| `CENTOS_12.IMG`| 6,651,904 | Hawk (stride 512) | Boots CENTOS (DOS 7.1)     |
| `CENTOS_13.IMG`| 6,651,904 | Hawk (stride 512) | Boots CENTOS (DOS 7.1-E)   |
| `FINCH2.BIN`   | 30,469,061| Finch          | Optional data disk             |
| `TORI.FFI`     | 32,524,800| Finch (512)    | Optional data disk             |

The server auto-mounts `CENTOS_13.IMG` (stride 512, sense = S2+S4 = 10).
