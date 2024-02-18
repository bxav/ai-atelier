## Header File Inclusion Order

When including header files, follow this specific order to maintain clean and readable code:

1. C++ Standard Library headers (like `<iostream>`, `<vector>`, etc.)
2. Third-party library headers (like `<boost/algorithm/string.hpp>`, etc.)
3. Project-specific headers (headers that are part of the current project)

Each group should be separated by a blank line. Within each group, headers should be sorted alphabetically.

## Use of `typedef` vs `using`

Prefer the `using` keyword over `typedef` for defining type aliases in C++11 and newer for its improved readability and flexibility, especially with template aliasing.

## Object-Oriented Programming Practices

Emphasize the use of RAII (Resource Acquisition Is Initialization) for resource management to ensure exception-safe code. Prefer smart pointers (`std::unique_ptr`, `std::shared_ptr`) over raw pointers for automatic memory management.

## Class and Struct Definition

Define classes and structs with clear access specifiers (`public`, `protected`, `private`). Start with public members followed by protected and then private members. Use struct for passive data structures with all public members and no functions.

## Modern C++ Features

Leverage modern C++ features for safer and more expressive code. Use `auto` for type inference where appropriate, range-based `for` loops for iterating over containers, and lambda expressions for inline function objects.

## Consistent Naming Conventions

Adopt and consistently apply naming conventions. Common practices include `CamelCase` for types (classes, structs, enums) and `snake_case` for variables and functions. Choose one and stick with it throughout the project.

## Header Guards

Use `#pragma once` at the beginning of header files to prevent multiple inclusions. Alternatively, use traditional include guards with unique macro names based on the file path and name.

## Inline Documentation

Use comments and documentation blocks to explain "why" something is done, not "what" is done. For public APIs, use Doxygen-compatible comments to enable easy generation of documentation.

## Avoid Using Macros for Constants or Functions

Prefer constexpr variables for constants and inline or template functions for parameterized expressions. Macros do not respect scope or type safety and can lead to hard-to-debug issues.

## Initializing Variables

Prefer brace initialization to avoid narrowing conversions and make initialization uniform and safer.

