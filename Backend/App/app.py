from flask import Flask
from flask import jsonify,after_this_request,make_response
import json
import sqlquery as query
from flask_cors import CORS, cross_origin
app = Flask(__name__)
CORS(app)
app.config['JSON_SORT_KEYS'] = False


@app.route('/getCases',methods=['GET'])
def getCases():
	all_rows=query.getCases()
	res={}
	for row in all_rows:
	  data={row[1]:{
	    "state":row[0],
	    "active":row[2],
	    "confirmed":row[3],
	    "deceased":row[4],
	    "recovered":row[5],
	    "priority":row[6],
	    "color":row[7]
	  }}
	  res.update(data)

	return jsonify(dict(res))

@app.route('/getSorted/<column_name>')
def getSorted(column_name):
	all_rows=query.getSortedByColumn(column_name)
	res={}
	for row in all_rows:
		data={row[1]:{
		"state":row[0],
		"active":row[2],
		"confirmed":row[3],
		"deceased":row[4],
		"recovered":row[5],
		"priority":row[6],
		"color":row[7]
		}}
		res.update(data)

	return jsonify(dict(res))


@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name

if __name__ == '__main__':
   app.run(host='localhost', port=5000)