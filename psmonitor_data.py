from datetime import datetime
import psutil
import pymongo
import socket

conn = pymongo.MongoReplicaSetClient(
    'example01.com, example02.com',
    replicaSet='rs1',
)
db = conn.reports

'''
Create data structure like this:
{
  datetime:
  cpu : {user:, nice:, system: idle: irq:},
  disk_root:,
  phymem:,
}
'''
def get_cpu(name):
    '''
    You can use this function to get the cpu usage of any process,
    assuming you know the process name. The function is unused in this example.
    '''
    pid_target = None
    cpu = 0
    for proc in psutil.process_iter():
        try:
            pinfo = proc.as_dict(attrs=['pid', 'name'])
        except psutil.NoSuchProcess:
            pass
        else:
            if pinfo['name'] == name:
                pid_target = pinfo['pid']

    if pid_target is not None:
        target = psutil.Process(pid=pid_target)
        cpu = target.cpu_percent(interval=1)

    return cpu

def main():
    cpu = psutil.cpu_times_percent()
    disk_root = psutil.disk_usage('/')
    phymem = psutil.phymem_usage()

    doc = dict()
    doc['server'] = socket.gethostname()
    doc['date'] = datetime.now()
    doc['disk_root'] = disk_root.free
    doc['phymem'] = phymem.free

    doc['cpu'] = {
        'user': cpu.user,
        'nice': cpu.nice,
        'system': cpu.system,
        'idle': cpu.idle,
        'irq': cpu.irq
    }

    if doc['server'] == 'example01.com':
        db.example01.insert(doc)
    elif doc['server'] == 'example02':
        db.example02.insert(doc)

if __name__ == '__main__':
    main()
