# Mermaid Diagrams Guide

## Overview
Mermaid is a powerful diagramming tool that lets you create diagrams and visualizations using text and code. This markdown editor now supports 10+ types of Mermaid diagrams!

---

## How to Use

### Basic Syntax
Wrap your Mermaid code in a code block with the `mermaid` language identifier:

\`\`\`mermaid
graph TD
    A[Start] --> B[End]
\`\`\`

### Using the Toolbar
1. Click the **Network icon** (⚡) in the editor toolbar
2. Select a diagram type from the dropdown
3. A template will be inserted into your document
4. Edit the code to customize your diagram
5. See the rendered diagram in the preview pane

---

## Diagram Types

### 1. Flowchart
**Use for**: Decision flows, process diagrams, algorithms

**Example**:
\`\`\`mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
\`\`\`

**Shapes**:
- `[Rectangle]` - Process
- `{Diamond}` - Decision
- `(Rounded)` - Start/End
- `((Circle))` - Connection point

**Arrows**:
- `-->` - Solid arrow
- `-.->` - Dotted arrow
- `==>` - Thick arrow

---

### 2. Sequence Diagram
**Use for**: API interactions, user flows, communication patterns

**Example**:
\`\`\`mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Click button
    Frontend->>Backend: API request
    Backend->>Database: Query data
    Database-->>Backend: Return data
    Backend-->>Frontend: JSON response
    Frontend-->>User: Display result
\`\`\`

**Arrow Types**:
- `->>` - Solid line with arrow
- `-->>` - Dotted line with arrow
- `-x` - Solid line with cross
- `--x` - Dotted line with cross

---

### 3. Class Diagram
**Use for**: Object-oriented design, system architecture

**Example**:
\`\`\`mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +eat()
    }
    class Dog {
        +String breed
        +bark()
        +fetch()
    }
    class Cat {
        +String color
        +meow()
        +scratch()
    }
    
    Animal <|-- Dog
    Animal <|-- Cat
\`\`\`

**Relationships**:
- `<|--` - Inheritance
- `*--` - Composition
- `o--` - Aggregation
- `-->` - Association
- `..>` - Dependency

---

### 4. State Diagram
**Use for**: State machines, workflow states, system states

**Example**:
\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: Start
    Loading --> Success: Data loaded
    Loading --> Error: Failed
    Success --> [*]
    Error --> Idle: Retry
    Error --> [*]: Give up
\`\`\`

---

### 5. ER Diagram (Entity Relationship)
**Use for**: Database design, data modeling

**Example**:
\`\`\`mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER ||--o{ DELIVERY-ADDRESS : uses
    
    CUSTOMER {
        string id PK
        string name
        string email
        date created_at
    }
    ORDER {
        string id PK
        string customer_id FK
        date order_date
        decimal total
    }
    LINE-ITEM {
        string id PK
        string order_id FK
        string product_id FK
        int quantity
        decimal price
    }
\`\`\`

**Relationships**:
- `||--||` - One to one
- `||--o{` - One to many
- `}o--o{` - Many to many

---

### 6. Gantt Chart
**Use for**: Project timelines, task scheduling

**Example**:
\`\`\`mermaid
gantt
    title Project Development Timeline
    dateFormat YYYY-MM-DD
    
    section Planning
    Requirements gathering    :a1, 2024-01-01, 14d
    Design mockups           :a2, after a1, 10d
    
    section Development
    Backend API              :a3, after a2, 30d
    Frontend UI              :a4, after a2, 35d
    Integration              :a5, after a3, 10d
    
    section Testing
    Unit testing             :a6, after a5, 7d
    Integration testing      :a7, after a6, 7d
    
    section Deployment
    Staging deployment       :a8, after a7, 3d
    Production deployment    :a9, after a8, 2d
\`\`\`

---

### 7. Pie Chart
**Use for**: Data distribution, percentages, proportions

**Example**:
\`\`\`mermaid
pie title Technology Stack Distribution
    "Frontend" : 35
    "Backend" : 30
    "Database" : 15
    "DevOps" : 10
    "Testing" : 10
\`\`\`

---

### 8. Git Graph
**Use for**: Version control visualization, branch strategies

**Example**:
\`\`\`mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout main
    merge feature
    commit
\`\`\`

---

### 9. Mind Map
**Use for**: Brainstorming, concept mapping, hierarchies

**Example**:
\`\`\`mermaid
mindmap
  root((Web Application))
    Frontend
      React
      Vue
      Angular
    Backend
      Node.js
      Python
      Java
    Database
      PostgreSQL
      MongoDB
      Redis
    DevOps
      Docker
      Kubernetes
      CI/CD
\`\`\`

---

### 10. Timeline
**Use for**: Historical events, project milestones

**Example**:
\`\`\`mermaid
timeline
    title Product Development Milestones
    2023-Q1 : Concept & Planning
            : Market Research
    2023-Q2 : MVP Development
            : Beta Testing
    2023-Q3 : Public Launch
            : Marketing Campaign
    2023-Q4 : Feature Expansion
            : User Growth
    2024-Q1 : International Launch
\`\`\`

---

## Advanced Features

### Styling
You can customize colors and styles:

\`\`\`mermaid
graph LR
    A[Normal] --> B[Success]
    A --> C[Warning]
    A --> D[Error]
    
    style B fill:#90EE90
    style C fill:#FFD700
    style D fill:#FF6B6B
\`\`\`

### Subgraphs
Group related nodes:

\`\`\`mermaid
graph TB
    subgraph Frontend
        A[React]
        B[Redux]
    end
    subgraph Backend
        C[Node.js]
        D[Express]
    end
    A --> C
    B --> D
\`\`\`

### Comments
Add comments to your diagrams:

\`\`\`mermaid
graph TD
    %% This is a comment
    A[Start] --> B[End]
    %% Comments are not rendered
\`\`\`

---

## Tips & Best Practices

### 1. Keep It Simple
- Start with basic diagrams
- Add complexity gradually
- Use clear, descriptive labels

### 2. Use Consistent Naming
- Use meaningful node IDs
- Follow a naming convention
- Keep labels concise

### 3. Organize Complex Diagrams
- Use subgraphs for grouping
- Break large diagrams into smaller ones
- Add comments for clarity

### 4. Test Your Diagrams
- Preview frequently
- Check for syntax errors
- Verify all connections

### 5. Choose the Right Diagram Type
- Flowchart: Processes and decisions
- Sequence: Interactions over time
- Class: Object relationships
- State: State transitions
- ER: Data relationships
- Gantt: Time-based tasks
- Pie: Proportions
- Git: Version control
- Mind Map: Hierarchies
- Timeline: Events

---

## Common Issues

### Diagram Not Rendering
**Causes**:
- Syntax error in Mermaid code
- Missing closing tags
- Invalid diagram type

**Solutions**:
1. Check syntax carefully
2. Verify code block has \`\`\`mermaid
3. Look for error messages in browser console
4. Try a simpler version first

### Diagram Too Large
**Solutions**:
- Break into multiple smaller diagrams
- Use subgraphs
- Simplify node labels
- Adjust zoom in browser

### Styling Not Working
**Solutions**:
- Check style syntax
- Verify node IDs match
- Use valid CSS colors
- Test with basic styles first

---

## Examples Library

### Simple Flowchart
\`\`\`mermaid
graph LR
    A[Input] --> B[Process]
    B --> C[Output]
\`\`\`

### API Flow
\`\`\`mermaid
sequenceDiagram
    Client->>+Server: HTTP Request
    Server->>+Database: Query
    Database-->>-Server: Data
    Server-->>-Client: HTTP Response
\`\`\`

### System Architecture
\`\`\`mermaid
graph TB
    subgraph Client
        A[Web Browser]
        B[Mobile App]
    end
    subgraph Server
        C[Load Balancer]
        D[API Server]
        E[Auth Service]
    end
    subgraph Data
        F[Database]
        G[Cache]
    end
    A --> C
    B --> C
    C --> D
    D --> E
    D --> F
    D --> G
\`\`\`

### User Journey
\`\`\`mermaid
stateDiagram-v2
    [*] --> Homepage
    Homepage --> Login: Click Login
    Homepage --> Browse: Browse Products
    Login --> Dashboard: Success
    Browse --> ProductPage: Select Product
    ProductPage --> Cart: Add to Cart
    Cart --> Checkout: Proceed
    Checkout --> Payment: Confirm
    Payment --> Success: Complete
    Success --> [*]
\`\`\`

---

## Resources

- **Mermaid Documentation**: https://mermaid.js.org/
- **Live Editor**: https://mermaid.live/
- **Syntax Reference**: https://mermaid.js.org/intro/syntax-reference.html
- **Examples**: https://mermaid.js.org/ecosystem/integrations.html

---

## Quick Reference

| Diagram Type | Keyword | Use Case |
|-------------|---------|----------|
| Flowchart | `graph` | Processes, decisions |
| Sequence | `sequenceDiagram` | Interactions, APIs |
| Class | `classDiagram` | OOP design |
| State | `stateDiagram-v2` | State machines |
| ER | `erDiagram` | Database design |
| Gantt | `gantt` | Project timelines |
| Pie | `pie` | Data distribution |
| Git | `gitGraph` | Version control |
| Mind Map | `mindmap` | Brainstorming |
| Timeline | `timeline` | Historical events |

---

**Happy Diagramming! 📊**
