import sqlite3, ast

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

def getSortedByColumns(column_dict):
	'''
	Returns all the rows sorted by Column
	params:
	column_name : string
	'''
	dict_obj=None
	try:
		dict_obj=ast.literal_eval(column_dict)
	except:
		return None
	conn = sqlite3.connect(current_path) #change path here
	c = conn.cursor()
	fmtstr = ', '.join([f'{col} {order.upper()}' for col, order in dict_obj.items()])
	c.execute(f'''select * from main order by {fmtstr};''')
	# print(f'''select * from main order by {fmtstr};''')
	rows=c.fetchall()
	c.close()
	return rows