import os
import sys
import time
import logging
import psutil
import pygetwindow as gw
import pyperclip

log_file_path = 'activity_log.txt'

logging.basicConfig(filename=log_file_path, level=logging.INFO, format='%(asctime)s [%(levelname)s]: %(message)s')

def log_process_info():
    active_window = gw.getActiveWindow()
    if active_window is not None:
        logging.info(f"Active Window: {active_window.title}")
        clipboard_content = pyperclip.paste()
        if clipboard_content:
            logging.info(f"Clipboard Content: {clipboard_content}")

def start_monitoring(interval=10):
    while True:
        try:
            log_process_info()
            time.sleep(interval)
        except KeyboardInterrupt:
            logging.info('Monitoring stopped.')
            sys.exit(0)

if __name__ == "__main__":
    if not os.path.isfile(log_file_path):
        with open(log_file_path, 'w'):
            pass

    try:
        logging.info('Monitoring started...')
        start_monitoring()
    except KeyboardInterrupt:
        logging.info('Monitoring stopped.')
        sys.exit(0)
