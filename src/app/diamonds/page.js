"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitInquiry } from "@/redux/inquirySlice";
import toast from "react-hot-toast";
import Layout from "@/components/layout/Layout";

/** ---------- helpers ---------- */
const formatMoney = (n) =>
  new Intl.NumberFormat("en-HK", {
    style: "currency",
    currency: "HKD",
    maximumFractionDigits: 0,
  }).format(n);

/** ---------- data ---------- */
const SHAPES = [
  {
    id: "Round",
    svg: (
      <img
        src="/shape/Round.png"
        className="h-8 w-8 object-contain"
        alt="Round Diamond Shape"
      />
    ),
  },
  {
    id: "Princess",
    svg: (
      <img
        src="/shape/Princess.png"
        className="h-8 w-8 object-contain"
        alt="Princess Diamond Shape"
      />
    ),
  },
  {
    id: "Cushion",
    svg: (
      <img
        src="/shape/Cushion.png"
        className="h-8 w-8 object-contain"
        alt="Cushion Diamond Shape"
      />
    ),
  },
  {
    id: "Emerald",
    svg: (
      <img
        src="/shape/Emerald.png"
        className="h-8 w-8 object-contain"
        alt="Emerald Diamond Shape"
      />
    ),
  },
  {
    id: "Oval",
    svg: (
      <img
        src="/shape/Oval.png"
        className="h-8 w-8 object-contain"
        alt="Oval Diamond Shape"
      />
    ),
  },
  {
    id: "Pear",
    svg: (
      <img
        src="/shape/Pear.png"
        className="h-8 w-8 object-contain"
        alt="Pear Diamond Shape"
      />
    ),
  },
  {
    id: "Asscher",
    svg: (
      <img
        src="/shape/Asscher.png"
        className="h-8 w-8 object-contain"
        alt="Asscher Diamond Shape"
      />
    ),
  },
  {
    id: "Radiant",
    svg: (
      <img
        src="/shape/Radiant.png"
        className="h-8 w-8 object-contain"
        alt="Radiant Diamond Shape"
      />
    ),
  },
  {
    id: "Heart",
    svg: (
      <img
        src="/shape/Heart.png"
        className="h-8 w-8 object-contain"
        alt="Heart Diamond Shape"
      />
    ),
  },
  {
    id: "Marquise",
    svg: (
      <img
        src="/shape/Marquise.png"
        className="h-8 w-8 object-contain"
        alt="Marquise Diamond Shape"
      />
    ),
  },
  {
    id: "Trillion",
    svg: (
      <img
        src="/shape/Trillion.png"
        className="h-8 w-8 object-contain"
        alt="Trillion Diamond Shape"
      />
    ),
  },
  {
    id: "Other",
    svg: (
      <span className="text-[10px] tracking-widest uppercase font-semibold text-neutral-400">
        Other
      </span>
    ),
  },
];

const BUDGET_PRESETS = [
  { label: "Under HK$10k", min: 0, max: 10000 },
  { label: "HK$10k – HK$30k", min: 10000, max: 30000 },
  { label: "HK$30k – HK$60k", min: 30000, max: 60000 },
  { label: "HK$60k – HK$100k", min: 60000, max: 100000 },
  { label: "HK$100k – HK$200k", min: 100000, max: 200000 },
  { label: "HK$200k+", min: 200000, max: 2000000 },
];

const CARAT_PRESETS = [
  { label: "Under 0.50 ct", min: 0.1, max: 0.5 },
  { label: "0.50 – 1.00 ct", min: 0.5, max: 1.0 },
  { label: "1.00 – 1.50 ct", min: 1.0, max: 1.5 },
  { label: "1.50 – 2.00 ct", min: 1.5, max: 2.0 },
  { label: "2.00 – 3.00 ct", min: 2.0, max: 3.0 },
  { label: "3.00 ct+", min: 3.0, max: 15.0 },
];

const CLARITY = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "SI3",
  "I1",
  "I2",
  "I3",
];
const COLORS = ["D", "E", "F", "G", "H", "I", "J", "K", "L"];
const CUTS = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const POLISH = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const SYMM = ["Ideal", "Excellent", "Very Good", "Good", "Fair", "Poor"];
const FLUOR = ["None", "Faint", "Medium", "Strong", "Very Strong"];
const LABS = ["GIA", "IGI"];

export default function DiamondProductPage() {
  const dispatch = useDispatch();
  const { submitting } = useSelector((state) => state.inquiry);

  const [activeCategory, setActiveCategory] = useState("natural"); // 'natural'
  const [filters, setFilters] = useState({
    shape: "Round",
    clarity: [],
    color: [],
    cut: "Excellent",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    lab: [],
    price: [10000, 30000],
    carat: [0.5, 1.0],
  });

  const [notes, setNotes] = useState("");

  const OWNER_NUMBER = "9376557788";
  const OWNER_EMAIL = "prashil@dnitin.com";

  const setSingle = (key, val) =>
    setFilters((prev) => ({ ...prev, [key]: val }));

  const toggleMulti = (key, val) =>
    setFilters((prev) => {
      const set = new Set(prev[key]);
      set.has(val) ? set.delete(val) : set.add(val);
      return { ...prev, [key]: Array.from(set) };
    });

  const handleBudgetPreset = (preset) => {
    setFilters((prev) => ({ ...prev, price: [preset.min, preset.max] }));
  };

  const handleMinPriceChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setFilters((prev) => ({ ...prev, price: [num, prev.price[1]] }));
  };

  const handleMaxPriceChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setFilters((prev) => ({ ...prev, price: [prev.price[0], num] }));
  };

  const handleCaratPreset = (preset) => {
    setFilters((prev) => ({ ...prev, carat: [preset.min, preset.max] }));
  };

  const handleMinCaratChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setFilters((prev) => ({ ...prev, carat: [num, prev.carat[1]] }));
  };

  const handleMaxCaratChange = (val) => {
    const num = val === "" ? "" : Number(val);
    setFilters((prev) => ({ ...prev, carat: [prev.carat[0], num] }));
  };

  const shareViaEmail = async () => {
    const payload = {
      budget_min: Number(filters.price[0]) || 0,
      budget_max: Number(filters.price[1]) || 0,
      carat_min: Number(filters.carat[0]) || 0,
      carat_max: Number(filters.carat[1]) || 0,
      shape: filters.shape?.toLowerCase() || "",
      clarity_grades: filters.clarity.length ? filters.clarity : [],
      color_grades: filters.color.length ? filters.color : [],
      certification_labs: filters.lab.length ? filters.lab : [],
      cut_grades: filters.cut ? [filters.cut.toUpperCase()] : [],
      polish_grades: filters.polish ? [filters.polish.toUpperCase()] : [],
      symmetry_grades: filters.symmetry ? [filters.symmetry.toUpperCase()] : [],
      fluorescence_intensity: filters.fluorescence
        ? [filters.fluorescence.toUpperCase()]
        : [],
      additional_notes: notes || "",
    };

    try {
      const data = await dispatch(submitInquiry(payload)).unwrap();
      toast.success(data?.message);
      resetAll();
    } catch (err) {
      toast.error(`Failed to submit inquiry: ${err}`);
    }
  };

  const resetAll = () => {
    setFilters({
      shape: "Round",
      clarity: [],
      color: [],
      cut: "Excellent",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      lab: [],
      price: [10000, 30000],
      carat: [0.5, 1.0],
    });
    setNotes("");
  };

  return (
    <Layout>
      <div className="mx-auto w-full  px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-2 py-10 ">
          <h1 className="text-3xl font-medium text-neutral-900 tracking-widest">
            Explore Diamonds
          </h1>
        </div>
        {/* Main Specification Card */}
        <div className="bg-white p-6 sm:p-12 space-y-12 shadow-xs rounded-xl">
          {/* Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-4">
            {/* Budget Range Section */}
            <div className="space-y-6 text-left">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400 border-b border-neutral-100 pb-2.5">
                Budget Range (HKD)
              </h3>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BUDGET_PRESETS.map((p) => {
                  const active =
                    filters.price[0] === p.min && filters.price[1] === p.max;
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleBudgetPreset(p)}
                      className={`px-3 py-2.5 rounded-xl border text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-center
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-3xs"
                          : "border-neutral-200/60 text-neutral-600 bg-transparent hover:border-neutral-900 hover:text-neutral-900"
                        }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom inputs */}
              <div className="flex gap-4 items-center pt-2">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                    Min
                  </span>
                  <input
                    type="number"
                    value={filters.price[0] === "" ? "" : filters.price[0]}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3  border border-neutral-200 text-xs font-light text-neutral-800 focus:outline-none focus:border-neutral-900 bg-transparent rounded-xl"
                    placeholder="Min HKD"
                  />
                </div>
                <div className="text-neutral-300 font-light select-none">
                  &ndash;
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                    Max
                  </span>
                  <input
                    type="number"
                    value={filters.price[1] === "" ? "" : filters.price[1]}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3  border border-neutral-200 text-xs font-light text-neutral-800 focus:outline-none focus:border-neutral-900 bg-transparent rounded-xl"
                    placeholder="Max HKD"
                  />
                </div>
              </div>
            </div>
            {/* Carat Range Section */}
            <div className="space-y-6 text-left">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400 border-b border-neutral-100 pb-2.5">
                Carat Weight Range
              </h3>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CARAT_PRESETS.map((p) => {
                  const active =
                    filters.carat[0] === p.min && filters.carat[1] === p.max;
                  return (
                    <button
                      key={p.label}
                      onClick={() => handleCaratPreset(p)}
                      className={`px-3 py-2.5 border rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer text-center
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white shadow-3xs"
                          : "border-neutral-200/60 text-neutral-600 bg-transparent hover:border-neutral-900 hover:text-neutral-900"
                        }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom inputs */}
              <div className="flex gap-4 items-center pt-2">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                    Min
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={filters.carat[0] === "" ? "" : filters.carat[0]}
                    onChange={(e) => handleMinCaratChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-xs font-light text-neutral-800 focus:outline-none focus:border-neutral-900 bg-transparent rounded-xl"
                    placeholder="Min ct"
                  />
                </div>
                <div className="text-neutral-300 font-light select-none">
                  &ndash;
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] uppercase font-bold tracking-widest text-neutral-400">
                    Max
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={filters.carat[1] === "" ? "" : filters.carat[1]}
                    onChange={(e) => handleMaxCaratChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 text-xs font-light text-neutral-800 focus:outline-none focus:border-neutral-900 bg-transparent rounded-xl"
                    placeholder="Max ct"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Shapes selection */}
          <div className="space-y-4 pt-4 text-left">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400 border-b border-neutral-100 pb-2.5">
              Select Shape
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-3.5">
              {SHAPES.map((s) => {
                const active = filters.shape === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSingle("shape", s.id)}
                    className={`group flex flex-col items-center justify-center py-5 px-3 border rounded-xl transition-all duration-350 cursor-pointer
                        ${active
                        ? "border-neutral-900 bg-neutral-950/5 text-neutral-900"
                        : "border-neutral-200/60 hover:border-neutral-500 text-neutral-450 bg-transparent"
                      }`}
                    title={s.id}
                  >
                    <div className="h-9 w-9 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 select-none">
                      {s.svg}
                    </div>
                    <span className="mt-2.5 text-[9px] font-sans tracking-[0.18em] uppercase font-semibold">
                      {s.id}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Properties select grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 pt-4 text-left">
            {/* Clarity */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Clarity Grade
              </h3>
              <div className="flex flex-wrap gap-2">
                {CLARITY.map((c) => {
                  const active = filters.clarity.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleMulti("clarity", c)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Color Grade
              </h3>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const active = filters.color.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => toggleMulti("color", c)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lab */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Certification Lab
              </h3>
              <div className="flex flex-wrap gap-2">
                {LABS.map((l) => {
                  const active = filters.lab.includes(l);
                  return (
                    <button
                      key={l}
                      onClick={() => toggleMulti("lab", l)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cut */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Cut Grade
              </h3>
              <div className="flex flex-wrap gap-2">
                {CUTS.map((v) => {
                  const active = filters.cut === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSingle("cut", v)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Polish */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Polish
              </h3>
              <div className="flex flex-wrap gap-2">
                {POLISH.map((v) => {
                  const active = filters.polish === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSingle("polish", v)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symmetry */}
            <div className="space-y-3.5">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Symmetry
              </h3>
              <div className="flex flex-wrap gap-2">
                {SYMM.map((v) => {
                  const active = filters.symmetry === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSingle("symmetry", v)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fluorescence */}
            <div className="space-y-3.5 md:col-span-2">
              <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
                Fluorescence Intensity
              </h3>
              <div className="flex flex-wrap gap-2">
                {FLUOR.map((v) => {
                  const active = filters.fluorescence === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setSingle("fluorescence", v)}
                      className={`px-4 py-2 border text-[10px] font-sans font-bold uppercase tracking-widest transition-all duration-300 rounded-xl cursor-pointer
                          ${active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-600 bg-transparent hover:border-neutral-900"
                        }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-3.5 pt-4 text-left">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-neutral-400">
              Additional Specifications & Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Preferred table percentage, depth percentage, target certificate ID, or custom setting requirements..."
              className="w-full p-4 border border-neutral-200 bg-neutral-50/20 text-xs font-light text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors duration-300 rounded-xl"
              rows={4}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 pt-8 border-t border-neutral-100/80">
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-xl border border-neutral-250 bg-white text-neutral-700 font-sans font-bold text-[10px] tracking-widest uppercase hover:bg-neutral-50 transition-colors duration-300 cursor-pointer"
            >
              Reset
            </button>

            <button
              onClick={shareViaEmail}
              disabled={submitting}
              className="inline-flex rounded-xl justify-center items-center gap-2 px-8 py-3 bg-neutral-900 text-white font-sans font-bold text-[10px] tracking-widest uppercase hover:bg-neutral-850 transition-colors duration-300 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{submitting ? "Submitting..." : "send Inquiry"}</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
