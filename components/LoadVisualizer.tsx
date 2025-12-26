import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LoadStatus } from '../types';

interface LoadVisualizerProps {
  dryWeight: number;
  wetWeight: number;
  capacity: number;
  status: LoadStatus;
}

const LoadVisualizer: React.FC<LoadVisualizerProps> = ({ dryWeight, wetWeight, capacity, status }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 180; // Semi-circle
    const radius = Math.min(width, height * 2) / 2 - 20;
    const cy = height - 10;
    const cx = width / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Scale
    // Domain goes up to capacity * 1.5 to show potential overload visually
    const maxScale = capacity * 1.5; 
    const scale = d3.scaleLinear()
      .domain([0, maxScale])
      .range([-Math.PI / 2, Math.PI / 2]);

    // Arcs
    const arcBg = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    const arcDry = d3.arc()
      .innerRadius(radius - 20)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(scale(Math.min(dryWeight, maxScale)) as number)
      .cornerRadius(5);

    // Wet weight acts as a "ghost" outer ring or indicator
    // We will visualize wet weight as a thinner outer line to show potential stress
    const arcWet = d3.arc()
      .innerRadius(radius + 5)
      .outerRadius(radius + 10)
      .startAngle(-Math.PI / 2)
      .endAngle(scale(Math.min(wetWeight, maxScale)) as number)
      .cornerRadius(2);

    const g = svg.append("g")
      .attr("transform", `translate(${cx}, ${cy})`);

    // Background track
    g.append("path")
      .attr("d", arcBg as any)
      .attr("fill", "#e2e8f0"); // slate-200

    // Dry Weight Arc (Main Indicator)
    let color = "#22c55e"; // Green
    if (status === LoadStatus.HEAVY) color = "#eab308"; // Yellow
    if (status === LoadStatus.OVERLOAD) color = "#ef4444"; // Red

    g.append("path")
      .attr("d", arcDry as any)
      .attr("fill", color)
      .transition()
      .duration(750)
      .attrTween("d", function(d) {
        const i = d3.interpolate(scale(0) as number, scale(Math.min(dryWeight, maxScale)) as number);
        return function(t) {
            // @ts-ignore
            arcDry.endAngle(i(t));
            return arcDry(d as any) || "";
        }
      });

    // Wet Weight Arc (Stress Indicator)
    g.append("path")
      .attr("d", arcWet as any)
      .attr("fill", "#3b82f6") // Blue for water
      .attr("opacity", 0.6);

    // Labels
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -30)
      .attr("class", "text-3xl font-bold fill-slate-800")
      .style("font-size", "36px")
      .style("font-weight", "bold")
      .text(`${dryWeight.toFixed(1)} kg`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -10)
      .attr("class", "text-sm fill-slate-500")
      .style("font-size", "12px")
      .text(`Seco (Capacidad: ${capacity}kg)`);

    // Limit Line
    const limitAngle = scale(capacity) as number;
    const lineLen = 30;
    
    // Convert polar to cartesian
    const x1 = (radius - 20) * Math.sin(limitAngle);
    const y1 = -(radius - 20) * Math.cos(limitAngle);
    const x2 = (radius + 15) * Math.sin(limitAngle);
    const y2 = -(radius + 15) * Math.cos(limitAngle);

    g.append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "#334155")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2");

  }, [dryWeight, wetWeight, capacity, status]);

  return (
    <div className="flex flex-col items-center justify-center py-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      <svg ref={svgRef} width={300} height={180} className="overflow-visible"></svg>
      <div className="flex gap-4 mt-2 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Peso Seco</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 opacity-60"></div>
          <span>Peso Mojado (Est.)</span>
        </div>
      </div>
      <div className="mt-4 text-center px-4">
        <p className="text-sm text-slate-600">
           Peso mojado estimado: <span className="font-semibold text-blue-600">{wetWeight.toFixed(1)} kg</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          El peso mojado afecta la inercia del tambor. Mantén el peso seco bajo el límite para evitar sobreesfuerzo.
        </p>
      </div>
    </div>
  );
};

export default LoadVisualizer;