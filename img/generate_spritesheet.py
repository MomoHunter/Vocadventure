import os
import json
import textwrap

from PIL import Image, ImageSequence


sprite_img_data_per_category = {}
sprite_dict_data = {}

start_marker_text = '// start spriteDict'
end_marker_text = '// end spriteDict'
comment_text = """\
// The following code is auto-generated, don't change it!
/**
 * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet as a key-value-dict.
 * @type {Object.<string, [boolean, number, number|Array<number>, number, number]>}
 * Each value's array has the contents: isAnimated, x-pos, y-pos, width, height.
 * If isAnimated is true, y-pos is an array, otherwise just a single number.
 */"""
text_indent = '  '


# region Search for all Images to pack:
for path, _, filenames in os.walk('sprites'):
    if len(filenames) < 1:
        continue  # directory with only folders, we need to go deeper

    _, category, *rest = path.split('\\')  # path is i.e. sprites\\Item\\Star
    sub_path = '/'.join(rest)
    if sub_path:
        sub_path += '/'

    file_names = [os.path.splitext(sub_path + name) for name in filenames if name.endswith(('.png', '.gif'))]
    for name, ext in file_names:
        new_img_data = {
            'is_anim': ext == '.gif',
            'full_name': category + '_' + name.replace('/', '_')
        }

        im = Image.open('sprites/' + category + '/' + name + ext)
        width, height = im.getdata().size
        if new_img_data.get('is_anim'):
            total_height = (height + 1) * sum([1 for f in ImageSequence.Iterator(im)])
        else:
            total_height = height
        new_img_data.update({
            'width': width,
            'height': height,
            'total_height': total_height,
            'im': im
        })

        if category in sprite_img_data_per_category:
            sprite_img_data_per_category.update({
                category: sprite_img_data_per_category.get(category) + [new_img_data]
            })
        else:
            sprite_img_data_per_category.update({
                category: [new_img_data]
            })
# endregion

# region Built Sprite-Sheet
sprite_sheet_img = Image.new(
    "RGBA",
    (
        sum([max([
            entry.get('width') for entry in category]) + 1 for category in sprite_img_data_per_category.values()
        ]),
        max([sum([
            entry.get('total_height') + 1 for entry in category]) for category in sprite_img_data_per_category.values()
        ])
    )
)

x = 0
for _, category in sprite_img_data_per_category.items():
    y = 0
    max_width = 0
    for entry in category:
        if entry.get('is_anim'):
            all_y = []
            for frame in ImageSequence.Iterator(entry.get('im')):
                sprite_sheet_img.paste(frame, (x, y, x + entry.get('width'), y + entry.get('height')))
                all_y.append(y)
                y += entry.get('height') + 1
            sprite_dict_data.update({entry.get('full_name'): [True, x, all_y, entry.get('width'), entry.get('height')]})
        else:
            sprite_sheet_img.paste(entry.get('im').getdata(), (x, y, x + entry.get('width'), y + entry.get('height')))
            sprite_dict_data.update({entry.get('full_name'): [False, x, y, entry.get('width'), entry.get('height')]})
            y += entry.get('height') + 1

        max_width = max([max_width, entry.get('width')])
    x += max_width + 1

sprite_sheet_img.save('Spritesheet.png', 'PNG')
# endregion

# region Update Sprite-Dict
sprite_dict_text = json.dumps(sprite_dict_data)\
    .replace('{', '{\n' + text_indent)\
    .replace('], "', '],\n' + text_indent + '"')\
    .replace(']}', ']\n}')
#   => one item per line plus indent for the inner lines
#   (when using the indent option of dumps, it splits tha data into separate lines)
sprite_dict_text = 'this.spriteDict = ' + sprite_dict_text + ';'

file_text_dict = textwrap.indent(
    '\n'.join([start_marker_text, comment_text, sprite_dict_text, end_marker_text]),
    text_indent
)

with open('../scripts/canvasDict.js') as f:  # read surrounding text
    file_text = f.read()
    file_text_pre, file_text = file_text.split(text_indent + start_marker_text)
    _, file_text_post = file_text.split(end_marker_text)

with open('../scripts/canvasDict.js', 'w') as f:  # clear file and write new text
    f.writelines([file_text_pre, file_text_dict, file_text_post])
# endregion
