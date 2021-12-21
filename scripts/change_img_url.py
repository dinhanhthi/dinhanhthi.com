from helper import dat_dir, sample_full_path, get_full_name, lst_files_in_samples
import sys


def change_url(file_name):
    """ Replace image url in the md file to {{ img-url }}
        How to use?
            File must be placed in dinhanhthi.com/notes/sample_posts/
            Images must be placed in dinhanhthi.com/notes/img_tmp/
            py scripts/change_img_url.py ydkjsy-1
    """
    try:
        img_tmp = dat_dir + '/notes/img_tmp'
        full_name = get_full_name(file_name.strip(), lst_files_in_samples)
        full_path = sample_full_path + '/' + full_name
        with open(full_path, 'r') as file:
            filedata = file.read()

        filedata = filedata.replace(img_tmp, '{{ img-url }}')

        with open(full_path, 'w') as file:
            file.write(filedata)
            print('✅  Image URL in "' + full_name + '" has been changed!')
    except:
        print("🙅‍♂️ " + file_name + " is UNCHANGED !!!")


if __name__ == "__main__":
    change_url(sys.argv[1])
