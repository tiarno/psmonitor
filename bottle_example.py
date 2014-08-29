from bottle import Bottle
import pymongo
load = Bottle()

conn = pymongo.MongoReplicaSetClient(
    'example01.com, example02.com',
    replicaSet='rs1',
)
db = conn.reports

@load.get('/<server>')
def get_loaddata(server):
    cpu_user = list()
    cpu_nice = list()
    cpu_system = list()
    cpu_idle = list()
    cpu_irq = list()

    disk_root_free = list()
    phymem_free = list()

    data_cursor = list()
    if server == 'example02':
        data_cursor = db.example02.find()
    elif server == 'example01':
        data_cursor = db.example01.find()

    for data in data_cursor:
        date = '%s' % data['date']

        cpu_user.append([date, data['cpu']['user']])
        cpu_nice.append([date, data['cpu']['nice']])
        cpu_system.append([date, data['cpu']['system']])
        cpu_idle.append([date, data['cpu']['idle']])
        cpu_irq.append([date, data['cpu']['irq']])

        disk_root_free.append([date, data['disk_root']])
        phymem_free.append([date, data['phymem']])

    return {
            'cpu_user': cpu_user,
            'cpu_irq': cpu_irq,
            'cpu_system': cpu_system,
            'cpu_nice': cpu_nice,
            'cpu_idle': cpu_idle,
            'disk_root_free': disk_root_free,
            'phymem_free': phymem_free,
            }
