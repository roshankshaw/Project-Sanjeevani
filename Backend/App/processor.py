from sklearn.cluster import KMeans
import requests, pandas as pd
import numpy as np
import colorsys, os
from matplotlib import colors
import time, sqlite3, datetime

def parseDF(url, json_column, drop_columns):   
    
    # fetch json
    allIndiaData = requests.get(url).json()
    
    # extract data from json into dataframe
    stateCoronaDfs=[]
    for statename, stateData in allIndiaData.items():
        
        stateCoronaDf=pd.DataFrame(stateData)
        # normalize json columns and split them into individual columns
        normalizedColumns=pd.json_normalize(stateCoronaDf[json_column])
        stateCoronaDf.drop(columns=[json_column], inplace=True)
        normalizedColumns.index=stateCoronaDf.index
        stateCoronaDf[normalizedColumns.columns]=normalizedColumns[normalizedColumns.columns]
        if len(drop_columns):
            stateCoronaDf.drop(columns=drop_columns, inplace=True)
        stateCoronaDf.statecode=statename
        stateCoronaDfs.append(stateCoronaDf)    
    
    # final dataframe
    coronaDf=pd.concat(stateCoronaDfs)
    coronaDf['Constituency']=coronaDf.index
    coronaDf.set_index(["statecode", "Constituency"], inplace = True,
                            append = False, drop = True, verify_integrity=True)

    # drop row if active case is negative, nan or infinity
    coronaDf=coronaDf[coronaDf.active>=0]
    coronaDf = coronaDf[np.isfinite(coronaDf.active)]
    coronaDf=coronaDf[~coronaDf.active.isna()]
    
    # coronaDf.to_excel('hack.xlsx')
    return coronaDf


def _get_best_k(Ks, Costs):
    
    # elbow-method for best K selection
    points=np.array(list(zip(Ks, Costs)))
    A=points[0]
    B=points[-1]    
    distFromLine_AB = [np.linalg.norm(np.cross(B-A, A-point))/np.linalg.norm(B-A) 
                 for point in points]
    
    return int(Ks[np.argmax(distFromLine_AB)])


def choose_colors(num_colors):
    colors=[]
    for i in np.arange(0., 360., 360. / num_colors):
        hue = i/360.
        lightness = (50 + np.random.rand() * 10)/100.
        saturation = (90 + np.random.rand() * 10)/100.
        colors.append(colorsys.hls_to_rgb(hue, lightness, saturation))
    return np.array(colors)


def cluster_risk(risks, max_cluster):
    
    risks=np.array(risks).reshape(-1, 1)    
    Ks=list(range(2, max_cluster+1))
    Costs=[]    
    KMeansModels={}

    # dissimilarity would not be defined for a single cluster, thus, minimum number of clusters should be 2
    for k in Ks:
        classifier = KMeans(n_clusters = k)
        classifier.fit(risks)
        Costs.append(classifier.inertia_)
        KMeansModels[k]=classifier

    k_optimum=_get_best_k(Ks, Costs)
    colors=choose_colors(k_optimum)
    labels=KMeansModels[k_optimum].predict(risks)
    
    return colors[labels], KMeansModels[k_optimum].cluster_centers_[labels]


def dataProcessing(intervalInMinutes, database, max_cluster, API):
        
    Pass=0
    while True:
        
        coronaDf=parseDF(url=API, json_column='districtData', 
                        drop_columns=['notes', 'delta.confirmed', 'delta.deceased', 'delta.recovered'])
        
        activeCases = coronaDf.active.to_numpy(dtype='float64')
        labels, centers = cluster_risk(activeCases, max_cluster=max_cluster)
        time.sleep(intervalInMinutes*60)
        coronaDf['priority']=centers
        coronaDf['color'] = np.apply_along_axis(colors.to_hex, 1, labels) 
        
        if not os.path.isdir(os.path.dirname(database)):
            os.makedirs(os.path.dirname(database))
            
        cnx = sqlite3.connect(database)
        coronaDf.to_sql(name='main', con=cnx, if_exists='replace', 
                        index_label=['statecode', 'Constituency'])
        cnx.close()

        print(f'{datetime.datetime.now()}: {Pass+1}th updation done.')
        Pass=Pass+1
    
#     plt.ylim(-10, 10)
#     for casecount, label in zip(activeCases, labels):
#         plt.scatter(casecount, 0.0, color=label)
#     plt.show()
if __name__ == '__main__':
    dataProcessing(intervalInMinutes=0.2, database='../Database/corona.db', 
                   max_cluster=10, API='https://api.covid19india.org/state_district_wise.json')