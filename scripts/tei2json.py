"""
tei2json.py
Python Script to generate a Vocabulary compatible JSON for vocab input from FreeDict TEI files.
For usage help call 'python3 tei2json.py -h'.
Tested with English-Norwegian dictionary from https://download.freedict.org/generated/eng-nor/.
"""

import xml.etree.ElementTree as xml
from itertools import product, groupby
import json
import sys
import argparse
import pathlib

__author__ = "niklaskoopmann"
__version__ = "1"
__maintainer__ = "TBD"
__status__ = "Production"

# set up argument parser
parser = argparse.ArgumentParser(prog="TEI2JSON", description="Convert a TEI dictionary to JSON interpretable by Vocadventure.")

# add arguments for input and output paths
parser.add_argument(
    "-i",
    "--input",
    help="Path to input TEI file",
    type=pathlib.Path, 
    required=True
)
parser.add_argument(
    "-o",
    "--output",
    help="Path to ouput JSON file or directory. If not provided, output will be in input directory",
    type=pathlib.Path,
    required=False
)
parser.add_argument(
    "-s",
    "--source-language",
    help="Language already known by learner to be used as base (default: english)",
    type=str,
    default="english",
    required=False
)
parser.add_argument(
    "-d",
    "--destination-language",
    help="Language to be learned as target (default: danoNorwegian)",
    type=str,
    default="danoNorwegian",
    required=False
)
parser.add_argument(
    "-t",
    "--tag",
    help="Language tag to be used for this vocab list (default: NOB)",
    type=lambda x: x if x.isalpha() and len(x) == 3 else "NOB",
    default="NOB",
    required=False
)
parser.add_argument(
    "-x",
    "--index",
    help="Vocab index to be set in output JSON",
    type=int,
    required=True
)
args = parser.parse_args()

# extract paths from arguments
INPUT_PATH = args.input.absolute()
OUTPUT_PATH = args.output.absolute() if args.output is not None else args.input.with_suffix(".json").absolute()

# extract language info from arguments
SOURCE_LANG = args.source_language
TARGET_LANG = args.destination_language

# get root of XML
tei_ns = {"tei":"http://www.tei-c.org/ns/1.0"}
xml.register_namespace("", tei_ns["tei"])
root = xml.parse(args.input.absolute()).getroot()

# get all "entry" elements
entries = root.find("tei:text", namespaces=tei_ns).find("tei:body", namespaces=tei_ns).findall("tei:entry", namespaces=tei_ns)

# set up dict list for JSON export
translations = []

# iterate over all dictionary entries
for entry in entries:

    # one word can have multiple english translations
    # or multiple norwegian translations or both
    # so here all possible combinations will be listed
    english_translations = entry.find("tei:form", namespaces=tei_ns).findall("tei:orth", namespaces=tei_ns)
    engl_list = [en.text for en in english_translations]

    # and of course all the norwegian translations
    norwegian_translations = entry.find("tei:sense", namespaces=tei_ns).find("tei:cit", namespaces=tei_ns).findall("tei:quote", namespaces=tei_ns)
    norw_list = [no.text for no in norwegian_translations]

    # get grammatical category
    try:
        grammatical_category = entry.find("tei:gramGrp", namespaces=tei_ns).find("tei:pos", namespaces=tei_ns).text
    except:
        grammatical_category = ""

    # iterate over tuples in list combination
    for pair in list(product(engl_list, norw_list)):
        translations.append({ SOURCE_LANG : pair[0] , TARGET_LANG : pair[1], "category" : grammatical_category, "difficulty" : 1 })

# sort and group translations by category
translations.sort(key=lambda content: content["category"])
translations = groupby(translations, lambda content: content["category"])

# get all categories and translations
categories = []
new_translations = []
for k, g in translations:
    if k != '':
        categories.append(k)
    for thing in g:
        new_translations.append(thing)

# set up final output JSON
output_dict = { 
    "index" : args.index, 
    "tag" : args.tag,
    "targetLanguage" : TARGET_LANG,
    "supportedLanguages" : [ SOURCE_LANG ],
    "isCustom" : False,
    "categories" : []
}

# add items for each category to dict
for i, cat in enumerate(categories):

    # set up category
    output_dict["categories"].append({ "index" : i+1, TARGET_LANG : cat, "words" : [] })
    
    # get all words for current category
    words_in_category = [x for x in new_translations if "category" in x and x["category"] == cat]

    # add each word to category (without category)
    for word in words_in_category:
        word.pop("category")
        output_dict["categories"][i]["words"].append(word)

with open(OUTPUT_PATH, "w") as outfile:
    json.dump(output_dict, outfile)
