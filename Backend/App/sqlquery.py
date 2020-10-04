import sqlite3

current_path= '../Database/corona.db'
def getCases():
	'''
	Returns all the constituencies with current cases and other details
	'''
	conn = sqlite3.connect(current_path) #change path here
	c = conn.cursor()
	c.execute(f'''select * from main;''')
	rows=c.fetchall()
	c.close()
	return rows

def getSortedByColumn(column_name):
	'''
	Returns all the rows sorted by Column
	params:
	column_name : string
	'''
	conn = sqlite3.connect(current_path) #change path here
	c = conn.cursor()
	c.execute(f'''select * from main order by {column_name} ;''')
	rows=c.fetchall()
	c.close()
	return rows