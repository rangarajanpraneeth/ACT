import os
import pandas as pd
import matplotlib.pyplot as plt

from matplotlib.ticker import MaxNLocator


def graph2D(filePath, colorProperty, graphType):
    dataFrame = pd.read_csv(
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../data", filePath))
    )
    plt.style.use("dark_background")
    cmap = "plasma"
    if graphType == "space":
        plt.subplots_adjust(
            left=0, bottom=0.02, right=1.02, top=0.98, wspace=0, hspace=0
        )

        plt.axis("equal")
        plt.axis("off")

        plt.scatter(
            dataFrame["carPositionX"],
            dataFrame["carPositionZ"],
            c=dataFrame[colorProperty],
            cmap=cmap,
        )

        cb = plt.colorbar(label=colorProperty)

        if colorProperty == "inputGear":
            cb.locator = MaxNLocator(integer=True)
            cb.update_ticks()
    elif graphType == "time":
        plt.scatter(
            dataFrame["timestamp"] / 10000000,
            dataFrame[colorProperty],
            c=dataFrame[colorProperty],
            cmap=cmap,
        )
        cb = plt.colorbar(label=colorProperty)

        if colorProperty == "inputGear":
            cb.locator = MaxNLocator(integer=True)
            cb.update_ticks()
    elif graphType == "3d":
        fig = plt.figure()
        ax = fig.add_subplot(111, projection="3d")

        plt.subplots_adjust(left=0, bottom=0, right=1, top=1, wspace=0, hspace=0)

        ax.grid(False)

        ax.set_xticks([])
        ax.set_yticks([])
        ax.set_zticks([])

        ax.xaxis.set_pane_color((0, 0, 0))
        ax.yaxis.set_pane_color((0, 0, 0))
        ax.zaxis.set_pane_color((0, 0, 0))

        ax.scatter(
            dataFrame["carPositionX"],
            dataFrame["carPositionZ"],
            dataFrame["carPositionY"],
            c=dataFrame[colorProperty],
            cmap=cmap,
        )

        ax.axis("equal")
    plt.show()


graph2D("1706588888204.csv", "carSpeed", "space")
