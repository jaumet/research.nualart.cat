'''
Basic xlrd operations

Let’s say we have an Excel workbook containing a small table repeated over three worksheets. The table in each case looks like this:
... table ...
Here are some snippets of code — just scratching the surface — to interact with it programmatically:

'''

# Demonstrates basic xlrd functions for working with Excel files
# (Excel 97-2003)
import xlrd
# Open the workbook
wb = xlrd.open_workbook('excel-xlrd-sample.xls')
# Print the sheet names
print wb.sheet_names()
# Get the first sheet either by index or by name
sh = wb.sheet_by_index(0)
# Iterate through rows, returning each as a list that you can index:
for rownum in range(sh.nrows):
    print sh.row_values(rownum)
# If you just want the first column:
first_column = sh.col_values(0)
print first_column
# Index individual cells:
cell_c4 = sh.cell(3, 2).value
# Or you can use:
#cell_c4 = sh.cell(rowx=3, colx=2).value
print cell_c4
# Let's say you want the same cell from x identical sheets in a workbook:
x = 2
while x >= 0:
    sh = wb.sheet_by_index(x)
    cell_x = sh.cell(2, 3).value
    print cell_x
    x = x - 1

###########################
'''

From Excel to JSON

Pretty cool stuff. Now, let’s convert our sample spreadsheet to JSON. I’ll borrow some of the techniques I discussed when outlining how to use Python to build JSON from a SQL database:
'''

import xlrd
from collections import OrderedDict
import simplejson as json
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('excel-xlrd-sample.xls')
sh = wb.sheet_by_index(0)
# List to hold dictionaries
cars_list = []
# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    cars = OrderedDict()
    row_values = sh.row_values(rownum)
    cars['car-id'] = row_values[0]
    cars['make'] = row_values[1]
    cars['model'] = row_values[2]
    cars['miles'] = row_values[3]
    cars_list.append(cars)
# Serialize the list of dicts to JSON
j = json.dumps(cars_list)
# Write to file
with open('data.json', 'w') as f:
    f.write(j)

