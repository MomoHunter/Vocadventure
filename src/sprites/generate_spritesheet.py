import os
import json

from PIL import Image, ImageSequence

SPRITESHEET_WIDTH = 2000
SPRITE_EXT = '.png'
ANIMATION_EXT = '.webp'
SPRITESHEET_PATH = '../assets/spritesheet.png'
SPRITE_DICT_PATH = '../canvas/spritedict.json'

sprite_img_data = []
sprite_dict_data = {}
smallest_width = None
smallest_height = None
spritesheet_filling = [[False for i in range(SPRITESHEET_WIDTH - 1)]]

text_indent = '  '
text_indent_2 = '    '

print('Searching for sprites...')

# region Search for all Images to pack
for path, _, filenames in os.walk('sprites'):
    if len(filenames) == 0:
        continue # directory with only folders, we need to go deeper

    filtered_filenames = [
        os.path.splitext('/'.join(path.split('\\')[1:]) + '/' + name) # path is i.e. sprites\\item\\star
        for name in filenames
        if name.endswith((SPRITE_EXT, ANIMATION_EXT))
    ]

    for name, ext in filtered_filenames:
        img_file = Image.open('sprites/' + name + ext)
        img_width, img_height = img_file.getdata().size

        # to have a pixel of clearance to the right and bottom
        img_width += 1
        img_height += 1

        if smallest_width == None or smallest_width > img_width:
            smallest_width = img_width
        if smallest_height == None or smallest_height > img_height:
            smallest_height = img_height

        if ext == ANIMATION_EXT:
            frame_count = sum([1 for f in ImageSequence.Iterator(img_file)])
            for index in range(frame_count):
                sprite_img_data.append({
                    'is_anim': True,
                    'full_name': name.replace('/', '_'),
                    'width': img_width,
                    'height': img_height,
                    'img': img_file,
                    'index': index,
                    'frames': frame_count
                })
        else:
            sprite_img_data.append({
                'is_anim': False,
                'full_name': name.replace('/', '_'),
                'width': img_width,
                'height': img_height,
                'img': img_file,
                'index': 0
            })

sprite_img_data.sort(key=lambda img_data: img_data['height'], reverse=True)
# endregion

print('Evaluating position of sprites...')

# region Algorithm for packing images to use as less space as possible
for img_data in sprite_img_data:
    place_found = False
    row_index = 0

    while not place_found: # counter for rows, cause rows are unknown
        img_max_y = row_index + img_data.get('height')

        if img_max_y > len(spritesheet_filling):
            for i in range(img_max_y - len(spritesheet_filling)):
                spritesheet_filling.append([False for i in range(SPRITESHEET_WIDTH - 1)])

        for column_index in range(0, SPRITESHEET_WIDTH - 1, smallest_width):
            if not spritesheet_filling[row_index][column_index]:
                while column_index > 0 and not spritesheet_filling[row_index][column_index - 1]:
                    column_index -= 1
            else:
                continue

            img_max_x = column_index + img_data.get('width')
            if img_max_x > SPRITESHEET_WIDTH - 1: # end of image
                break

            if (not spritesheet_filling[row_index][column_index] and
                not spritesheet_filling[img_max_y - 1][img_max_x - 1]):
                is_free = True
                for i in [row_index, img_max_y - 1]:
                    for j in range(column_index, img_max_x, smallest_width):
                        if spritesheet_filling[i][j]:
                            is_free = False
                            break
                    if not is_free:
                        break
                if not is_free:
                    continue

                for j in [column_index, img_max_x - 1]:
                    for i in range(row_index, img_max_y, smallest_height):
                        if spritesheet_filling[i][j]:
                            is_free = False
                            break
                    if not is_free:
                        break
                if not is_free:
                    continue

                # has found place, will save info
                img_data.update({
                    'x': column_index + 1, # extra free pixel
                    'y': row_index + 1 # extra free pixel
                })
                for i in range(row_index, img_max_y):
                    for j in range(column_index, img_max_x):
                        spritesheet_filling[i][j] = True
                
                place_found = True
            
            if place_found:
                break

        if not place_found:
            row_index += 1
        else:
            print('Found position for:', img_data.get('full_name'), '(Index {0})'.format(img_data.get('index')))
# endregion

print('Building spritesheet...')

# region Build spritesheet
spritesheet_img = Image.new("RGBA", (SPRITESHEET_WIDTH, len(spritesheet_filling) + 1))

for img_data in sprite_img_data:
    x = img_data.get('x')
    y = img_data.get('y')
    width = img_data.get('width') - 1
    height = img_data.get('height') - 1
    if img_data.get('is_anim'):
        full_name = img_data.get('full_name')
        if full_name in sprite_dict_data:
            sprite_dict_data.get(full_name)[2].update({
                img_data.get('index'): y
            })
            sprite_dict_data.get(full_name)[1].update({
                img_data.get('index'): x
            })
            if len(sprite_dict_data.get(full_name)[1]) == img_data.get('frames'):
                frame_no = 0
                for frame in ImageSequence.Iterator(img_data.get('img')):
                    x = sprite_dict_data.get(full_name)[1].get(frame_no)
                    y = sprite_dict_data.get(full_name)[2].get(frame_no)
                    spritesheet_img.paste(frame, (x, y, x + width, y + height))
                    frame_no += 1
        else:
            sprite_dict_data.update({
                full_name: [True, { img_data.get('index'): x }, { img_data.get('index'): y }, width, height]
            })
    else:
        sprite_dict_data.update({
            img_data.get('full_name'): [False, x, y, width, height]
        })
        spritesheet_img.paste(img_data.get('img').getdata(), (x, y, x + width, y + height))

for sprite in sprite_dict_data.values():
    if sprite[0]:
        x_all = []
        y_all = []
        for i in range(len(sprite[1])):
            x_all.append(sprite[1].get(i))
        for i in range(len(sprite[2])):
            y_all.append(sprite[2].get(i))
        sprite[1] = x_all
        sprite[2] = y_all

spritesheet_img.save(SPRITESHEET_PATH, 'PNG')
# endregion

print('Building sprite dict...')

# region Update sprite dict
sprite_dict_text = json.dumps(sprite_dict_data)\
    .replace('{', '{\n' + text_indent)\
    .replace('], "', '],\n' + text_indent + '"')\
    .replace(']}', ']\n}')
#   => one item per line plus indent for the inner lines
#   (when using the indent option of dumps, it splits tha data into separate lines)

with open(SPRITE_DICT_PATH, 'w', encoding='utf-8') as f:  # clear file and write new text
    f.seek(0)
    f.write(sprite_dict_text)
    f.truncate()
# endregion

print('Successfully finished!')
