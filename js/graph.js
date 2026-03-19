// SciDiscover Graph JavaScript
// D3.js Knowledge Graph Visualization

class KnowledgeGraph {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = 400;
        this.svg = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        
        this.init();
    }

    init() {
        // Clear container
        this.container.innerHTML = '';
        
        // Create SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewBox', [0, 0, this.width, this.height])
            .style('background', 'rgba(3, 5, 20, 0.4)')
            .style('border-radius', '12px');
    }

    // Sample data for demo
    getSampleData() {
        return {
            nodes: [
                { id: 'neuro', name: 'Neuroscience', group: 1, value: 20 },
                { id: 'ai', name: 'AI', group: 2, value: 15 },
                { id: 'ml', name: 'ML', group: 2, value: 12 },
                { id: 'bio', name: 'Biology', group: 3, value: 10 },
                { id: 'phys', name: 'Physics', group: 4, value: 8 }
            ],
            links: [
                { source: 'neuro', target: 'ai', value: 5 },
                { source: 'neuro', target: 'bio', value: 3 },
                { source: 'ai', target: 'ml', value: 4 },
                { source: 'ai', target: 'phys', value: 2 },
                { source: 'bio', target: 'phys', value: 1 }
            ]
        };
    }

    // Render graph with data
    render(data = null) {
        if (!this.svg) return;
        
        // Use sample data if none provided
        const graphData = data || this.getSampleData();
        this.nodes = graphData.nodes;
        this.links = graphData.links;

        // Create arrow marker
        this.svg.append('defs').selectAll('marker')
            .data(['end'])
            .enter().append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#7FFFD4')
            .attr('opacity', 0.6);

        // Create links
        const link = this.svg.append('g')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('stroke', '#7FFFD4')
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', d => Math.sqrt(d.value))
            .attr('marker-end', 'url(#arrow)');

        // Create nodes
        const node = this.svg.append('g')
            .selectAll('circle')
            .data(this.nodes)
            .enter().append('circle')
            .attr('r', d => d.value)
            .attr('fill', d => this.getNodeColor(d.group))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.8)
            .call(this.drag(this.simulation))
            .on('mouseover', this.handleMouseOver)
            .on('mouseout', this.handleMouseOut);

        // Add labels
        const label = this.svg.append('g')
            .selectAll('text')
            .data(this.nodes)
            .enter().append('text')
            .text(d => d.name)
            .attr('font-size', 10)
            .attr('font-weight', 'bold')
            .attr('fill', '#fff')
            .attr('text-anchor', 'middle')
            .attr('dy', d => -d.value - 5);

        // Setup simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => d.value + 10))
            .on('tick', () => {
                link
                    .attr('x1', d => d.source.x)
                    .attr('y1', d => d.source.y)
                    .attr('x2', d => d.target.x)
                    .attr('y2', d => d.target.y);

                node
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y);

                label
                    .attr('x', d => d.x)
                    .attr('y', d => d.y);
            });
    }

    // Update graph with new data
    update(newData) {
        if (!this.svg) return;
        
        // Stop current simulation
        if (this.simulation) {
            this.simulation.stop();
        }
        
        // Clear and re-render
        this.init();
        this.render(newData);
    }

    // Clear graph
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        if (this.simulation) {
            this.simulation.stop();
        }
    }

    // Resize graph
    resize() {
        if (!this.container) return;
        
        this.width = this.container.clientWidth;
        this.height = 400;
        
        if (this.svg) {
            this.svg.attr('width', this.width)
                .attr('height', this.height)
                .attr('viewBox', [0, 0, this.width, this.height]);
            
            // Recenter simulation
            if (this.simulation) {
                this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
                this.simulation.alpha(0.3).restart();
            }
        }
    }

    // Get color based on node group
    getNodeColor(group) {
        const colors = {
            1: '#3B82F6', // Blue - Neuroscience
            2: '#8B5CF6', // Purple - AI/ML
            3: '#10B981', // Green - Biology
            4: '#F59E0B', // Orange - Physics
            5: '#EF4444'  // Red - Medicine
        };
        return colors[group] || '#94A3B8';
    }

    // Drag handler
    drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }

    // Mouse over handler
    handleMouseOver(event, d) {
        d3.select(event.currentTarget)
            .attr('stroke', '#7FFFD4')
            .attr('stroke-width', 3)
            .attr('r', d.value + 5);
    }

    // Mouse out handler
    handleMouseOut(event, d) {
        d3.select(event.currentTarget)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('r', d.value);
    }

    // Load real data from API
    async loadFromAPI(connectionCount = 10) {
        try {
            const data = await API.getRecentConnections(connectionCount);
            this.update(this.convertToGraphData(data));
        } catch (error) {
            console.error('Failed to load graph data:', error);
        }
    }

    // Convert API connections to graph format
    convertToGraphData(connections) {
        const nodes = [];
        const links = [];
        const nodeMap = new Map();
        
        connections.forEach((conn, index) => {
            // Add field1 node
            if (!nodeMap.has(conn.field1)) {
                nodeMap.set(conn.field1, {
                    id: conn.field1.toLowerCase(),
                    name: conn.field1,
                    group: this.getGroupFromField(conn.field1),
                    value: 10 + Math.floor(Math.random() * 10)
                });
            }
            
            // Add field2 node
            if (!nodeMap.has(conn.field2)) {
                nodeMap.set(conn.field2, {
                    id: conn.field2.toLowerCase(),
                    name: conn.field2,
                    group: this.getGroupFromField(conn.field2),
                    value: 10 + Math.floor(Math.random() * 10)
                });
            }
            
            // Add link
            links.push({
                source: conn.field1.toLowerCase(),
                target: conn.field2.toLowerCase(),
                value: Math.floor(conn.strength / 20) + 1
            });
        });
        
        return {
            nodes: Array.from(nodeMap.values()),
            links: links
        };
    }

    // Get group number from field name
    getGroupFromField(field) {
        const fieldLower = field.toLowerCase();
        if (fieldLower.includes('neuro')) return 1;
        if (fieldLower.includes('ai') || fieldLower.includes('ml') || fieldLower.includes('machine')) return 2;
        if (fieldLower.includes('bio') || fieldLower.includes('protein')) return 3;
        if (fieldLower.includes('phys') || fieldLower.includes('quantum')) return 4;
        if (fieldLower.includes('med') || fieldLower.includes('drug')) return 5;
        return 6;
    }
}

// Initialize graph when dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('knowledgeGraph')) {
        window.graph = new KnowledgeGraph('knowledgeGraph');
        
        // Load sample data initially
        window.graph.render();
        
        // Optional: Load real data from API
        // window.graph.loadFromAPI(10);
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.graph) {
        window.graph.resize();
    }
});