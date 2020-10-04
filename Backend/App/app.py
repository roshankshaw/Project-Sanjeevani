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
	  data={row[6]:{
       "state":row[1],
       "active":row[2],
       "confirmed":row[3],
       "deceased":row[4],
       "recovered":row[5],
       "constituency":row[6],
       "color":row[14],
      "active_normalized":row[7],
      "deceased_normalized":row[8],
      "recovered_normalized":row[9],
      "confirmed_normalized":row[10],
      "population":row[11],
      "priority":row[12],
      "tuned_priority":row[13]
	  }}
	  res.update(data)

	return jsonify(dict(res))

@app.route('/getSorted/<column_name>')
def getSorted(column_name):
	all_rows=query.getSortedByColumn(column_name)
	res={}
	for i, row in enumerate(all_rows):
		data={i:{
      "state":row[1],
      "active":row[2],
      "confirmed":row[3],
      "deceased":row[4],
      "recovered":row[5],
      "constituency":row[6],
      "color":row[14],
      "active_normalized":row[7],
      "deceased_normalized":row[8],
      "recovered_normalized":row[9],
      "confirmed_normalized":row[10],
      "population":row[11],
      "priority":row[12],
      "tuned_priority":row[13],
      "index":i
    }}
		res.update(data)

	return jsonify(dict(res))

@app.route('/getSortedCols/<column_names>')
def getSortedCols(column_names):
	all_rows=query.getSortedByColumns(column_names)
  # if not all_rows:
  #   return "send column map in correct format {'col1':'DESC','col2':'ASC'}"
	res={}
	for i, row in enumerate(all_rows):
		data={i:{
      "state":row[1],
      "active":row[2],
      "confirmed":row[3],
      "deceased":row[4],
      "recovered":row[5],
      "constituency":row[6],
      "color":row[14],
      "active_normalized":row[7],
      "deceased_normalized":row[8],
      "recovered_normalized":row[9],
      "confirmed_normalized":row[10],
      "population":row[11],
      "priority":row[12],
      "tuned_priority":row[13],
      "index":i
    }}
		res.update(data)

	return jsonify(dict(res))


@app.route('/hello/<name>')
def hello_name(name):
   return 'Hello %s!' % name

if __name__ == '__main__':
   app.run(host='localhost', port=5000)