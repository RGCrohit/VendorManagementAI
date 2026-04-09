"""
Logging configuration
"""
import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(f"logs/procurai_{datetime.now().strftime('%Y%m%d')}.log"),
    ]
)

logger = logging.getLogger(__name__)
