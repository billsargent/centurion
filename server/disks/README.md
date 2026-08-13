# Disk Images & Disk Packs

The emulator loads Hawk and Finch disk packs/images (`.IMG`, `.BIN`, `.FFI`)
into its drives. Stride is auto-detected from file size by the server and
browser. The following data disk packs are **committed** so a clone is
self-contained:

| File           | Size      | Kind          | Notes                          |
|----------------|-----------|---------------|--------------------------------|
| `FINCH2.BIN`   | 30,469,061| Finch          | Data disk pack                  |
| `TORI.FFI`     | 32,524,800| Finch (512)    | Data disk pack                  |

To load your own disk, drop a Hawk (`.IMG`) or Finch (`.FFI`) image in this
folder and use the Disk Manager (port 2326 — `[L]` load or `[0-7]` quick-mount)
or the browser UI.
