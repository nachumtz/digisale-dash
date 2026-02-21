import datetime
import pathlib

LOG_FILE = "error_log.md"

def log_error(context: str, error: Exception | str) -> None:
    """
    Logs an error to error_log.md with a timestamp.
    
    Format: [TIMESTAMP] [CONTEXT] ERROR: {error}
    """
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    error_message = str(error)
    
    log_line = f"[{timestamp}] [{context}] ERROR: {error_message}\n"
    
    # Ensure file exists, if not, create it with a header
    file_path = pathlib.Path(LOG_FILE)
    if not file_path.exists():
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("# Error Log - Digisale Dash\n\n")
            
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(log_line)
