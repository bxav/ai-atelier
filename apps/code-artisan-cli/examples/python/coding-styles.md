## Import Order

Follow PEP 8 guidelines for ordering imports to maintain clean and readable code:

1. Standard library imports (like `os`, `sys`)
2. Related third-party imports (like `numpy`, `pandas`)
3. Local application/library-specific imports

Use a blank line to separate each group of imports. Within each group, sort imports alphabetically.

## Using `class` instead of other structures for complex data

Prefer using classes to define complex data types and behavior, rather than dictionaries or tuples, for clarity and encapsulation.

## Function Definitions

Use def to define functions. Adopt type hinting for parameters and return values to enhance readability and facilitate type checking:

```python
def function_name(param1: int, param2: str) -> bool:
    # function body
```

## Consistent Naming Conventions

- Use `CamelCase` for class names.
- Use `snake_case` for functions, methods, and variables.
- Constants should be in `UPPER_CASE`.

## Docstrings and Comments

Use docstrings to describe classes and functions. Docstrings should follow PEP 257. Comments within the code should explain "why" something is done, not "what" is done.

```python
class MyClass:
    """Brief description of the class."""

    def my_method(self):
        """Brief description of the method."""
        # Comment explaining the "why" of complex logic
```

## Avoiding Wildcard Imports

Avoid wildcard imports (`from module import *`) to maintain clarity and avoid namespace pollution.

## Error Handling

Use try-except blocks for error handling instead of checks like `if not data`. Be specific with exception types to avoid catching unintended exceptions.

## List Comprehensions and Generator Expressions

Use list comprehensions and generator expressions for concise and readable transformations of sequences.

```python
squared = [x**2 for x in range(10)]
```

## Consistent Use of Quotes

Choose either single quotes `'` or double quotes `"` and use them consistently throughout the project. PEP 8 suggests using `'` unless a string contains single quote characters.

## Line Length and Whitespace

Follow PEP 8's recommendation of 79 characters for code lines and 72 for comments. Use whitespace around operators and after commas for readability.

## Leveraging Pythonic Idioms

Embrace Pythonic idioms and standard library features for more concise and efficient code, such as using `with` for resource management and `enumerate` for looping over sequences with an index.

```

This Python coding style guide incorporates standard Python conventions and idioms, as recommended by PEP 8 (Python Enhancement Proposal 8), which is the style guide for Python code. It's tailored to ensure code clarity, maintainability, and Pythonic practices.
