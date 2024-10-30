import json
from typing import Optional


class Job:
    """Job class for scheduling"""

    def __init__(
        self,
        name: Optional[str] = None,
        job_duration: Optional[str] = None,
        gpus: Optional[str] = None,
        num_nodes: Optional[str] = None
    ):
        self.name = name
        self.job_duration = job_duration
        self.gpus = gpus
        self.num_nodes = num_nodes

    def to_json(self):
        return {
            "name": self.name,
            "train_epoch_len": self.job_duration,
            "gpus": self.gpus,
            "num_nodes": self.num_nodes,
        }

    def from_json(self, filename):
        f = open(filename)
        data = json.load(f)
        self.name = data["name"] if "name" in data.keys() else None
        self.job_duration = data["train_epoch_len"] if "train_epoch_len" in data.keys() else None
        self.gpus = data["gpus"] if "gpus" in data.keys() else None
        self.num_nodes = data["num_nodes"] if "num_nodes" in data.keys() else None
