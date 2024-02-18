## Example 1:

```py
import math
from datetime import datetime

class GeometryCalculator:
    """A simple class for geometric calculations."""

    @staticmethod
    def calculate_circle_area(radius):
        """Calculates the area of a circle given its radius."""
        return math.pi * radius ** 2

    @staticmethod
    def calculate_square_area(side):
        """Calculates the area of a square given one side length."""
        return side * side


def print_current_time_and_area(radius, side):
    """Prints the current time and the area of a circle and a square."""
    now = datetime.now()
    circle_area = GeometryCalculator.calculate_circle_area(radius)
    square_area = GeometryCalculator.calculate_square_area(side)

    print(f"Current time: {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Area of circle with radius {radius}: {circle_area:.2f}")
    print(f"Area of square with side {side}: {square_area:.2f}")


# Example usage
if __name__ == "__main__":
    print_current_time_and_area(radius=5, side=10)

```
