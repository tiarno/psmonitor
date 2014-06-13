from datetime import datetime
import psutil
import pymongo
import socket

conn = pymongo.MongoReplicaSetClient(
    'example01.com, example02.com',
    replicaSet='rs1',
    read_preference=pymongo.ReadPreference.SECONDARY_PREFERRED,
)
db = conn.reports

'''
Create data structure like this:
{
  datetime:
  cpu : {user:, nice:, system: idle: irq:},
  disk_app:  {total:, used:, free: },
  disk_root: {total:, used:, free:},
  phymem:    {total:, used:, free: },
  virtmem:   {total:, used:, free: },
}
'''
def get_cpu(name):
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
    virtmem = psutil.virtmem_usage()

    doc = dict()
    doc['server'] = socket.gethostname()
    doc['date'] = datetime.now()
    doc['amd'] = get_cpu('amd')

    doc['cpu'] = {'user': cpu.user, 'nice': cpu.nice,
                  'system': cpu.system, 'idle': cpu.idle,
                  'irq': cpu.irq}

    doc['disk_root'] = {'total': disk_root.total, 'used': disk_root.used, 'free': disk_root.free}
    doc['phymem'] = {'total': phymem.total, 'used': phymem.used, 'free': phymem.free}
    doc['virtmem'] = {'total': virtmem.total, 'used': virtmem.used, 'free': virtmem.free}

    if doc['server'] == 'example01.com':
        db.monitor01.insert(doc)
    elif doc['server'] == 'example02':
        db.monitor02.insert(doc)

if __name__ == '__main__':
    main()
