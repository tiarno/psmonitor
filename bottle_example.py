from bottle import Bottle
import pymongo
load = Bottle()

conn = pymongo.MongoReplicaSetClient(
    'example01.com, example02.com',
    replicaSet='rs1',
    read_preference=pymongo.ReadPreference.SECONDARY_PREFERRED,
)
db = conn.reports

@load.get('/<server>')
def get_loaddata(server):
    cpu_user = list()
    cpu_nice = list()
    cpu_system = list()
    cpu_idle = list()
    cpu_irq = list()

    disk_app_free = list()
    disk_root_free = list()
    phymem_free = list()
    amd = list()

    if server == 'example02':
        data_cursor = db.monitor02.find()
    elif server == 'example01':
        data_cursor = db.monitor01.find()

    for data in data_cursor:
        date = '%s' % data['date']

        cpu_user.append([date, data['cpu']['user']])
        cpu_nice.append([date, data['cpu']['nice']])
        cpu_system.append([date, data['cpu']['system']])
        cpu_idle.append([date, data['cpu']['idle']])
        cpu_irq.append([date, data['cpu']['irq']])

        disk_root_free.append([date, data['disk_root']['free']])
        phymem_free.append([date, data['phymem']['free']])
        amd.append([date, data['amd']])

    return {
            'cpu_user': cpu_user,
            'cpu_irq': cpu_irq,
            'cpu_system': cpu_system,
            'cpu_nice': cpu_nice,
            'cpu_idle': cpu_idle,
            'disk_app_free': disk_app_free,
            'disk_root_free': disk_root_free,
            'phymem_free': phymem_free,
            'amd': amd,
            }
