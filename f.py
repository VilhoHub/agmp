import pandas as pd
import json

# File paths
csv_file_path = 'C:/Users/vilho/Documents/agmp/data/geodata_inventory.csv'  # Uploaded file path
json_file_path = 'C:/Users/vilho/Documents/agmp/data/geodata_inventory.json'  # Output JSON file path

# Read the CSV file with encoding handling
df = pd.read_csv(csv_file_path, encoding='ISO-8859-1')

# Replace NaN values with empty string
df = df.fillna(" ")

# Convert to JSON with "data" wrapper
data = {"data": df.to_dict(orient="records")}

# Save to JSON file
with open(json_file_path, 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, indent=4, ensure_ascii=False)

print(f'JSON file saved at: {json_file_path}')
