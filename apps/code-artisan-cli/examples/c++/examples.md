## Example 1:

```cpp
#ifndef RESOURCE_MANAGER_HPP
#define RESOURCE_MANAGER_HPP

#include <iostream>
#include <memory>
#include <vector>

class ResourceManager {
public:
    ResourceManager() {
        std::cout << "ResourceManager initialized" << std::endl;
    }

    void loadData() {
        // Simulate loading data into the resource
        auto data = std::make_shared<std::vector<int>>();
        for (int i = 0; i < 10; ++i) {
            data->push_back(i);
        }

        resource = data;
        std::cout << "Data loaded into resource" << std::endl;
    }

    void processData() {
        if (resource) {
            std::cout << "Processing data: ";
            for (auto& num : *resource) {
                std::cout << num << " ";
            }
            std::cout << std::endl;
        } else {
            std::cout << "No data to process" << std::endl;
        }
    }

    ~ResourceManager() {
        std::cout << "ResourceManager cleaned up" << std::endl;
    }

private:
    std::shared_ptr<std::vector<int>> resource;
};

#endif // RESOURCE_MANAGER_HPP

```
