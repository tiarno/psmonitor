from datetime import datetime

import psutil
import pymongo
import socket

conn = pymongo.MongoClient()
db = conn.myserver

def is_up(name):
    up = False
    if name.startswith('myserver'):
        for conn in psutil.net_connections():
            if conn.laddr.port == 10000:
                up = True
                break
    else:
        up = None
    return up

def main():
    server_name = socket.gethostname()
    doc = {
        'server': server_name,
        'date' : datetime.now(),
        'cpu' : psutil.cpu_percent(interval=1),
        'disk_app' : psutil.disk_usage('/Apps').free,
        'disk_root' : psutil.disk_usage('/').free,
        'memory' : psutil.virtual_memory().free,
        'myapp': is_up(server_name)
    }
    db.monitor.insert(doc)

if __name__ == '__main__':
    main()
