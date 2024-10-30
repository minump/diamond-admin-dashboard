import bashlex
import re
import json


def text_to_json(text):
    flag = False
    key = ""
    data = {}
    pattern = r"WordNode\(pos=\((\d+), (\d+)\), word='([^']+)'\)"

    # Using re.findall to extract all matching groups
    matches = re.findall(pattern, text)

    # Output the matches
    for match in matches:
        start_pos, end_pos, word = match
        print(f"Start: {start_pos}, End: {end_pos}, Word: {word}")
        if word.startswith("--") == True and flag == False:
            if len(word.split("=")) == 2:
                data[word.split("=")[0][2:]] = word.split("=")[1]
            elif len(word.split("=")) == 1:
                flag = True
                key = word[2:]
            else:
                raise ValueError("The case we cannot handle")
        elif word.startswith("--") == False and flag == True:
            data[key] = word
            flag = False
        elif word.startswith("--") == True and flag == True:
            flag = False
        else:
            pass

    with open("sample.json", "w") as outfile:
        json.dump(data, outfile, indent=2)


"""Here, we demonstrate how to convert a script into a JSON file."""

parts = bashlex.parse(
    "python /opt/openfold/train_openfold.py \
        /scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/pdb_mmcif/mmcif_files \
        /scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/alignment_openfold \
        /scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/pdb_mmcif/mmcif_files \
        full_output \
        2021-10-10 \
        --val_data_dir /scratch1/00946/zzhang/datasets/openfold/openfold/cameo/mmcif_files \
        --val_alignment_dir /scratch1/00946/zzhang/datasets/openfold/openfold/cameo/alignments \
        --template_release_dates_cache_path=/scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/mmcif_cache.json \
        --precision=32 \
        --train_epoch_len 128000 \
        --gpus=4 \
        --num_nodes=1 \
        --accumulate_grad_batches 8 \
        --replace_sampler_ddp=True \
        --seed=7152022 \
        --deepspeed_config_path=/scratch1/00946/zzhang/frontera/openfold/deepspeed_config.json \
        --checkpoint_every_epoch \
        --obsolete_pdbs_file_path=/scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/pdb_mmcif/obsolete.dat \
        --train_chain_data_cache_path=/scratch1/00946/zzhang/datasets/openfold/openfold/ls6-tacc/chain_data_cache.json"
)

text = ""

for ast in parts:
    text += ast.dump()

text_to_json(text)

