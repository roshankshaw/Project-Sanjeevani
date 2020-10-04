from ipynb.fs.full.processor import dataProcessing

if __name__ == '__main__':

	dataProcessing(intervalInMinutes=0.2, database='../Database/corona.db',
		max_cluster=10, API='https://api.covid19india.org/state_district_wise.json',
		normalize_columns=['active', 'deceased', 'recovered', 'confirmed'],
		censusFile='../Census Data/census-2011.csv')