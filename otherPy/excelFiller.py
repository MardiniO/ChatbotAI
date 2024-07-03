import pandas as pd
import numpy as np

# Number of rows you want
num_rows = 100000

# Generate random values for two columns
column1 = np.random.rand(num_rows)
column2 = np.random.rand(num_rows)

# Create a DataFrame
df = pd.DataFrame({
    'Column1': column1,
    'Column2': column2
})

# Save the DataFrame to an Excel file
df.to_excel('/Desktop/random_values.xlsx', index=False)
