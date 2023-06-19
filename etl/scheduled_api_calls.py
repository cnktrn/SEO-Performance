from ryte import extract_data_for_x_days, update_ryte
from ga4 import updateGA4
from google_search_console import update_gsc
import csv
import ast

"""
bucket="Analytica"
attributeList = [ "count_links_outgoing",
            "count_links_outgoing_external",
            "count_links_outgoing_internal",
            "count_incoming_translations",
            "count_translations",
            "page_speed",
            "passes_juice_to_url",
            "server_connect_time",
            "server_load_time",
            "speed_index"]
api_key="7df8cf7ef1981515ad93199d2cda8fed"
project="p9a6b2adea2a2853eadcbbd3fe6f20cd"

#update_ryte(bucket, attributeList, api_key, project)

attributeListGA4 = ["screenPageViewsPerUser", "activeUsers", "bounceRate", "screenPageViewsPerSession","totalUsers","sessions"]
#updateGA4(attributeListGA4, bucket, "sessions", "329272465")
"""
#update_gsc("sc-domain:analytica.de", "Analytica", "impressions")

# Open the CSV file for reading
with open('data.csv', 'r') as file:
    csv_reader = csv.reader(file, delimiter=',')

    # Iterate through each row in the CSV file
    for row in csv_reader:
        # Check if the entry in the first column is "GSC"
        if row[0] == "GSC":
            #update_gsc(row[1], row[2], "impressions")
            pass
        if row[0] == "GA4":
            attributeList = ast.literal_eval(row[1])
            #updateGA4(attributeList, row[2], "sessions", row[3])
        if row[0] == "Ryte":
            attributeList = ast.literal_eval(row[2])
            print(row[3])
            print(row[4])
            update_ryte(row[1], attributeList, "7df8cf7ef1981515ad93199d2cda8fed", "p9a6b2adea2a2853eadcbbd3fe6f20cd", "speed_index")