psmonitor
=========

**Note:**
The `master` branch is an update from python2 to python3. The `python2` branch 
corresponds to the earlier version that goes along with the 
previous [article](https://reachtim.com/articles/psutil-and-mongodb-for-system-monitoring.html).

The code here corresponds to the new [article](https://reachtim.com/articles/diy-system-monitoring-part-1.html)

Monitor a server using `psutil` (python) + MongoDB + JavaScript for graphics

The data capture program runs in a cron job, inserting new data into a Mongodb
capped collection.

Requires
---------

    * mongodb installation
    * pymongo python package
    * psutil python package
    * python 3.x
    * NodeJS (example server included)

Run psmonitor.py in a cron job, something like this to run every 5 minutes::

    */5 * * * * /usr/local/bin/python /path/to/load_data.py

