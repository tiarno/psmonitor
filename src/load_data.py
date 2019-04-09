from datetime import datetime

import psutil
import pymongo
import socket

conn = pymongo.MongoClient()
db = conn.saslatex

def myapp_isup(name):
    up = 'false'
    if name.startswith('myserver'):
        for conn in psutil.net_connections():
            if conn.laddr.port == 10000:
                up = 'true'
                break
    else:
        up = 'NA'
    return up

def main():
    server_name = socket.gethostname()
    doc = {
        'server': server_name,
        'date' : datetime.now(),
        'cpu' : psutil.cpu_percent(interval=1),
        'disk_app' : psutil.disk_usage('/AppDocs').free,
        'disk_root' : psutil.disk_usage('/').free,
        'phymem' : psutil.virtual_memory().free,
        'myapp': myapp_isup(server_name)
    }
    db.monitor.insert(doc)

if __name__ == '__main__':
    main()
