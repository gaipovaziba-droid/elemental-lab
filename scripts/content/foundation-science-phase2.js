export const foundationRecipesPhase2 = [
  // Minimal, defensible Phase-2 recipes preserved for canonical integration.
  { a: 'element_h', b: 'element_h', result: 'hydrogen_molecule', type: 'chemical', quality: 'strong', explanation: 'Two hydrogen atoms form an H₂ molecule (simplified stoichiometry).' },
  { a: 'element_o', b: 'element_o', result: 'oxygen_molecule', type: 'chemical', quality: 'strong', explanation: 'Two oxygen atoms form an O₂ molecule.' },
  { a: 'element_c', b: 'element_o', result: 'carbon_dioxide', type: 'chemical', quality: 'strong', explanation: 'Carbon and oxygen combine to form CO₂ in many real-world oxidations (abstraction).' },
  { a: 'element_c', b: 'element_h', result: 'methane', type: 'chemical', quality: 'reasonable', explanation: 'Simplified formation: carbon combines with hydrogen to form methane (educational abstraction).' },
  { a: 'element_n', b: 'element_h', result: 'ammonia', type: 'chemical', quality: 'reasonable', explanation: 'Nitrogen and hydrogen combine to yield ammonia under catalytic conditions (abstracted).' },
  { a: 'element_na', b: 'element_cl', result: 'sodium_chloride', type: 'chemical', quality: 'strong', explanation: 'Sodium and chlorine form table salt (NaCl) through ionic combination.' },
  { a: 'element_si', b: 'element_o', result: 'silicon_dioxide', type: 'chemical', quality: 'strong', explanation: 'Silicon and oxygen form silicon dioxide (SiO₂), the main component of silica and quartz (simplified).' },
  { a: 'carbon_dioxide', b: 'base', result: 'carbonate', type: 'chemical', quality: 'reasonable', explanation: 'Carbon dioxide reacts with a basic aqueous solution to form carbonate species (simplified aqueous chemistry).' },
  { a: 'element_ca', b: 'carbonate', result: 'calcium_carbonate', type: 'chemical', quality: 'strong', explanation: 'Calcium ions and carbonate ions precipitate as calcium carbonate (CaCO₃), a common mineral.' },
  { a: 'element_fe', b: 'element_o', result: 'iron_oxide', type: 'chemical', quality: 'strong', explanation: 'Iron and oxygen commonly produce iron oxides (rust) in oxidizing conditions.' },

  // Bonding & solution concepts (minimal, reachable bridge for chemistry)
  { a: 'sodium_chloride', b: 'chemistry', result: 'ionic_bond', type: 'conceptual', quality: 'reasonable', explanation: 'Associate the common compound sodium chloride with the ionic bond concept (classification, not a literal formation reaction).' },
    // Solution components reachability — use concrete dissolution pathways
    { a: 'solution', b: 'chemistry', result: 'solute', type: 'conceptual', quality: 'reasonable', explanation: 'Classificatory mapping: solutions contain solutes; this associates the solution concept with the solute role for discoverability rather than describing a formation reaction.' },
    { a: 'water', b: 'chemistry', result: 'solvent', type: 'conceptual', quality: 'reasonable', explanation: 'Water is the prototypical solvent for many aqueous processes; associate water with the solvent role.' },
    { a: 'solute', b: 'solvent', result: 'mixture', type: 'chemical', quality: 'reasonable', explanation: 'Solutes dispersed in solvents form mixtures or solutions (classification).' },

    // Reaction roles and catalysts reachability — map identifiable species/solute to reactant role
    { a: 'element_h', b: 'oxygen_molecule', result: 'reactant', type: 'conceptual', quality: 'strong', explanation: 'Hydrogen and oxygen are reactants in the formation of water; this illustrates the reactant role without claiming every substance is a reactant.' },
    { a: 'reactant', b: 'chemistry', result: 'product', type: 'conceptual', quality: 'reasonable', explanation: 'Reactants in chemical contexts yield products; associate reactant roles with product classification for discoverability.' },
    { a: 'reactant', b: 'product', result: 'reaction', type: 'conceptual', quality: 'reasonable', explanation: 'Reactants and products define a chemical reaction; this pairs role concepts into the reaction concept.' },
  { a: 'metal', b: 'reaction', result: 'catalyst', type: 'conceptual', quality: 'reasonable', explanation: 'Many metal surfaces catalyze reactions by providing an alternative pathway and are regenerated overall; this is a role classification.' },

    // Neutron reachability via nuclear process abstraction
  { a: 'methane', b: 'chemistry', result: 'covalent_bond', type: 'conceptual', quality: 'reasonable', explanation: 'Associate methane with covalent bonding as an illustrative example (classification, not a literal formation reaction).' },
  { a: 'water', b: 'sodium_chloride', result: 'solution', type: 'chemical', quality: 'reasonable', explanation: 'Solids like sodium chloride dissolve in water to form aqueous solutions (educational abstraction).' },
  // Ion formation / classification (reachable via ionic bond concept)
  { a: 'element_na', b: 'ionic_bond', result: 'cation', type: 'conceptual', quality: 'reasonable', explanation: 'In ionic compounds sodium commonly exists as a positively charged cation; this associates the element with the cation concept (classification).' },
  { a: 'element_cl', b: 'ionic_bond', result: 'anion', type: 'conceptual', quality: 'reasonable', explanation: 'In ionic compounds chlorine commonly exists as a negatively charged anion; this associates the element with the anion concept (classification).' },
  { a: 'ionic_bond', b: 'chemistry', result: 'ion', type: 'conceptual', quality: 'reasonable', explanation: 'Ionic bonding produces charged ions; associate the ionic bond concept with the generic ion classification for discoverability.' },

  // Redox concepts (classification, not literal replacements of existing chemical recipes)
  // Oxidation/reduction: retain an oxygen-driven example but clarify electron transfer
  { a: 'burn', b: 'element_o', result: 'oxidation', type: 'conceptual', quality: 'reasonable', explanation: 'Combustion is an oxygen-rich example of oxidation; oxidation more generally refers to net loss of electrons in a chemical change (classification linking oxygen-driven examples to the electron-transfer concept).' },
  { a: 'electron', b: 'oxidation', result: 'reduction', type: 'conceptual', quality: 'strong', explanation: 'Reduction is the complementary electron-gain half of an oxidation process; this links the electron-transfer concepts.' },
  { a: 'oxidation', b: 'reduction', result: 'redox_reaction', type: 'conceptual', quality: 'reasonable', explanation: 'Oxidation and reduction are complementary parts of redox reactions (classification).' },

  // Solution chemistry measurements
  { a: 'acid', b: 'solution', result: 'pH', type: 'conceptual', quality: 'reasonable', explanation: 'pH is a measure related to acidic or basic solutions; this associates solution state with pH as a measured quantity.' },
  { a: 'solution', b: 'measure', result: 'concentration', type: 'conceptual', quality: 'reasonable', explanation: 'Concentration is the measured amount of solute in a solution; this links solution and measurement concepts.' },
  { a: 'solution', b: 'concentration', result: 'crystallization', type: 'physical', quality: 'reasonable', explanation: 'Crystallization commonly occurs from increased concentration or cooling of solutions; this links measurable concentration changes to crystallization for discoverability.' },

  // Catalysis and equilibrium
  { a: 'reaction', b: 'catalyst', result: 'catalysis', type: 'conceptual', quality: 'reasonable', explanation: 'Catalysts accelerate reactions without being consumed; this links catalyst and reaction concepts.' },
  { a: 'reaction', b: 'concentration', result: 'equilibrium', type: 'conceptual', quality: 'reasonable', explanation: 'Reaction rates and concentrations determine chemical equilibrium; this provides a minimal conceptual bridge.' },

  // Organic chemistry foundation (minimal bridge for molecular biology)
  { a: 'methane', b: 'covalent_bond', result: 'organic_compound', type: 'conceptual', quality: 'reasonable', explanation: 'Methane is a simple organic molecule; associating it with the covalent bond concept establishes a chemistry-based link to the category "organic compound" (classification).' },

  // Water cycle basics
  { a: 'water', b: 'sun', result: 'evaporation', type: 'physical', quality: 'strong', explanation: 'Solar heating commonly drives surface evaporation of water, though evaporation can occur from any heat source and does not strictly require sunlight.' },
  { a: 'steam', b: 'cold', result: 'condensation', type: 'physical', quality: 'strong', explanation: 'Cooling water vapor condenses into liquid droplets.' },
  { a: 'cloud', b: 'gravity', result: 'precipitation', type: 'physical', quality: 'strong', explanation: 'Condensed water in clouds falls as precipitation under gravity.' },

  // (Planetary impact recipes pruned to preserve reachability)
]

export const foundationElementsPhase2 = [
  { id: 'hydrogen_molecule', name: 'hydrogen_molecule', emoji: null, category: 'Chemistry', tags: ['molecule'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_h2.svg' } },
  { id: 'oxygen_molecule', name: 'oxygen_molecule', emoji: null, category: 'Chemistry', tags: ['molecule'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_o2.svg' } },
  { id: 'carbon_dioxide', name: 'carbon_dioxide', emoji: null, category: 'Chemistry', tags: ['molecule'], opts: { domain: 'chemical_sciences', subdomains: ['inorganic_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_co2.svg' } },
  { id: 'quartz', name: 'quartz', emoji: null, category: 'Materials', tags: ['mineral','silicate'], opts: { domain: 'chemical_sciences', subdomains: ['mineralogy'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_quartz.svg' } },
  { id: 'mineral', name: 'mineral', emoji: null, category: 'Geology', tags: ['material'], opts: { domain: 'earth_sciences', subdomains: ['mineralogy'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_mineral.svg' } },
  { id: 'evaporation', name: 'evaporation', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['hydrology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_evaporation.svg' } },
  { id: 'condensation', name: 'condensation', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['hydrology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_condensation.svg' } },
  { id: 'precipitation', name: 'precipitation', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['hydrology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_precipitation.svg' } },
    
  // Chemistry concepts and materials preserved
  { id: 'methane', name: 'methane', emoji: null, category: 'Chemistry', tags: ['molecule','hydrocarbon'], opts: { domain: 'chemical_sciences', subdomains: ['organic_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_methane.svg' } },
  { id: 'ammonia', name: 'ammonia', emoji: null, category: 'Chemistry', tags: ['molecule'], opts: { domain: 'chemical_sciences', subdomains: ['inorganic_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_ammonia.svg' } },
  { id: 'sodium_chloride', name: 'sodium_chloride', emoji: null, category: 'Chemistry', tags: ['salt'], opts: { domain: 'chemical_sciences', subdomains: ['inorganic_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_salt.svg' } },
  { id: 'ionic_bond', name: 'ionic_bond', emoji: null, category: 'Chemistry', tags: ['bond','concept'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_ionic_bond.svg' } },
  { id: 'covalent_bond', name: 'covalent_bond', emoji: null, category: 'Chemistry', tags: ['bond','concept'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_covalent_bond.svg' } },
  { id: 'solution', name: 'solution', emoji: null, category: 'Chemistry', tags: ['mixture','aqueous'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'system', epistemic_status: ['empirical_science'], icon: 'icon_solution.svg' } },
  { id: 'organic_compound', name: 'organic_compound', emoji: null, category: 'Chemistry', tags: ['organic'], opts: { domain: 'chemical_sciences', subdomains: ['organic_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_organic.svg' } },

  // Additional chemistry foundations (ions, pH, catalysts, equilibrium)
  { id: 'ion', name: 'ion', emoji: null, category: 'Chemistry', tags: ['charge'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_ion.svg' } },
  { id: 'cation', name: 'cation', emoji: null, category: 'Chemistry', tags: ['ion','positive'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_cation.svg' } },
  { id: 'anion', name: 'anion', emoji: null, category: 'Chemistry', tags: ['ion','negative'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_anion.svg' } },
  { id: 'mixture', name: 'mixture', emoji: null, category: 'Chemistry', tags: ['system'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'system', epistemic_status: ['empirical_science'], icon: 'icon_mixture.svg' } },
  { id: 'reactant', name: 'reactant', emoji: null, category: 'Chemistry', tags: ['reaction'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_reactant.svg' } },
  { id: 'product', name: 'product', emoji: null, category: 'Chemistry', tags: ['reaction'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'concept', epistemic_status: ['empirical_science'], icon: 'icon_product.svg' } },
  { id: 'oxidation', name: 'oxidation', emoji: null, category: 'Chemistry', tags: ['redox'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_oxidation.svg' } },
  { id: 'reduction', name: 'reduction', emoji: null, category: 'Chemistry', tags: ['redox'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_reduction.svg' } },
  { id: 'redox_reaction', name: 'redox_reaction', emoji: null, category: 'Chemistry', tags: ['reaction'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_redox.svg' } },
  { id: 'pH', name: 'pH', emoji: null, category: 'Chemistry', tags: ['measure'], opts: { domain: 'chemical_sciences', subdomains: ['analytical_chemistry'], output_type: 'quantity', epistemic_status: ['empirical_science'], icon: 'icon_ph.svg' } },
  { id: 'solvent', name: 'solvent', emoji: null, category: 'Chemistry', tags: ['solution'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_solvent.svg' } },
  { id: 'solute', name: 'solute', emoji: null, category: 'Chemistry', tags: ['solution'], opts: { domain: 'chemical_sciences', subdomains: ['general_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_solute.svg' } },
  { id: 'concentration', name: 'concentration', emoji: null, category: 'Chemistry', tags: ['quantity'], opts: { domain: 'chemical_sciences', subdomains: ['analytical_chemistry'], output_type: 'quantity', epistemic_status: ['empirical_science'], icon: 'icon_concentration.svg' } },
  { id: 'crystallization', name: 'crystallization', emoji: null, category: 'Chemistry', tags: ['process'], opts: { domain: 'chemical_sciences', subdomains: ['materials_chemistry'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_crystallization.svg' } },
  { id: 'catalyst', name: 'catalyst', emoji: null, category: 'Chemistry', tags: ['reaction'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_catalyst.svg' } },
  { id: 'catalysis', name: 'catalysis', emoji: null, category: 'Chemistry', tags: ['process'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_catalysis.svg' } },
  { id: 'equilibrium', name: 'equilibrium', emoji: null, category: 'Chemistry', tags: ['process'], opts: { domain: 'chemical_sciences', subdomains: ['physical_chemistry'], output_type: 'phenomenon', epistemic_status: ['empirical_science'], icon: 'icon_equilibrium.svg' } },
  { id: 'silicon_dioxide', name: 'silicon_dioxide', emoji: null, category: 'Materials', tags: ['mineral','silicate'], opts: { domain: 'chemical_sciences', subdomains: ['geochemistry'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_silica.svg' } },
  { id: 'calcium_carbonate', name: 'calcium_carbonate', emoji: null, category: 'Materials', tags: ['mineral','carbonate'], opts: { domain: 'chemical_sciences', subdomains: ['geochemistry'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_carbonate.svg' } },
  { id: 'iron_oxide', name: 'iron_oxide', emoji: null, category: 'Materials', tags: ['mineral','oxide'], opts: { domain: 'chemical_sciences', subdomains: ['geochemistry'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_iron_oxide.svg' } },
  { id: 'carbonate', name: 'carbonate', emoji: null, category: 'Chemistry', tags: ['ion','salt'], opts: { domain: 'chemical_sciences', subdomains: ['inorganic_chemistry'], output_type: 'substance', epistemic_status: ['empirical_science'], icon: 'icon_carbonate.svg' } },

  // Materials / minerals

  // (Earth structure entries pruned to preserve reachability)

  // Geological processes and rocks

  // Atmosphere & water systems
  

  // (Planetary entries pruned to preserve reachability)
]

// --- Geology / Earth structure additions ---
export const foundationRecipesPhase2Geology = [
  // crust and rock formation
  { a: 'lava', b: 'time', result: 'crust', type: 'physical', quality: 'reasonable', explanation: 'Lava that cools over time at the surface forms solid crustal material; this links eruptive material with crust formation.' },
  { a: 'magma', b: 'time', result: 'igneous_rock', type: 'physical', quality: 'strong', explanation: 'Magma that cools and solidifies over time forms igneous rocks; time abstracts cooling/solidification processes.' },

  // sedimentary and metamorphic pathways
  { a: 'rock', b: 'erosion', result: 'sediment', type: 'physical', quality: 'reasonable', explanation: 'Erosion of rock produces sediments which can later lithify into sedimentary rock.' },
  { a: 'sediment', b: 'pressure', result: 'sedimentary_rock', type: 'physical', quality: 'reasonable', explanation: 'Compaction and pressure on sediments leads to formation of sedimentary rocks (lithification abstraction).' },
  { a: 'rock', b: 'mantle', result: 'metamorphic_rock', type: 'physical', quality: 'reasonable', explanation: 'Burial into hot, high-pressure geologic environments like the mantle alters existing rock without melting, producing metamorphic rock.' },

  // surface processes
  { a: 'rock', b: 'water', result: 'weathering', type: 'physical', quality: 'strong', explanation: 'Weathering is the breakdown of rock in place via physical and chemical processes including water action.' },
  { a: 'weathering', b: 'water', result: 'erosion', type: 'physical', quality: 'strong', explanation: 'Erosion is the transport of weathered materials by water, wind, or ice.' },
  { a: 'erosion', b: 'gravity', result: 'deposition', type: 'physical', quality: 'reasonable', explanation: 'Deposition occurs when transported sediments settle under the influence of gravity.' },

  // lithosphere and plates
  { a: 'crust', b: 'mantle', result: 'lithosphere', type: 'physical', quality: 'reasonable', explanation: 'The lithosphere comprises the crust and uppermost mantle as a rigid outer shell (conceptual association).' },
  { a: 'lithosphere', b: 'pressure', result: 'tectonic_plate', type: 'physical', quality: 'reasonable', explanation: 'Large rigid sections of the lithosphere form tectonic plates influenced by mantle forces and stresses.' },
  { a: 'tectonic_plate', b: 'tectonic_plate', result: 'plate_tectonics', type: 'physical', quality: 'reasonable', explanation: 'Interactions among tectonic plates produce the system known as plate tectonics.' },
  { a: 'igneous_rock', b: 'sedimentary_rock', result: 'rock_cycle', type: 'conceptual', quality: 'strong', explanation: 'The rock cycle describes interconnected transformations among igneous, sedimentary, and metamorphic rocks.' },

  // mantle/core conceptualization
  { a: 'rock', b: 'heat', result: 'mantle', type: 'conceptual', quality: 'reasonable', explanation: 'Earth\'s mantle is predominantly hot, solid silicate rock that deforms slowly; this is a structural classification, not a literal mixture.' },
  { a: 'heat', b: 'gravity', result: 'differentiation', type: 'physical', quality: 'reasonable', explanation: 'Planetary differentiation is driven by heat and gravity, enabling dense materials to segregate.' },
  { a: 'earth', b: 'differentiation', result: 'core', type: 'physical', quality: 'reasonable', explanation: 'Planetary differentiation leads to the formation of an iron-rich core; this is a conceptual mapping, not a literal single-step formation recipe.' },
]

export const foundationElementsPhase2Geology = [
  { id: 'crust', name: 'crust', emoji: null, category: 'Geology', tags: ['layer'], opts: { domain: 'earth_sciences', subdomains: ['geology'], output_type: 'structure', epistemic_status: ['empirical_science'], icon: 'icon_crust.svg' } },
  { id: 'mantle', name: 'mantle', emoji: null, category: 'Geology', tags: ['layer'], opts: { domain: 'earth_sciences', subdomains: ['geophysics'], output_type: 'structure', epistemic_status: ['empirical_science'], icon: 'icon_mantle.svg' } },
  { id: 'core', name: 'core', emoji: null, category: 'Geology', tags: ['layer'], opts: { domain: 'earth_sciences', subdomains: ['geophysics'], output_type: 'structure', epistemic_status: ['empirical_science'], icon: 'icon_core.svg' } },
  { id: 'lithosphere', name: 'lithosphere', emoji: null, category: 'Geology', tags: ['layer'], opts: { domain: 'earth_sciences', subdomains: ['geology'], output_type: 'structure', epistemic_status: ['empirical_science'], icon: 'icon_lithosphere.svg' } },
  { id: 'tectonic_plate', name: 'tectonic_plate', emoji: null, category: 'Geology', tags: ['plate'], opts: { domain: 'earth_sciences', subdomains: ['geology','geophysics'], output_type: 'structure', epistemic_status: ['empirical_science'], icon: 'icon_plate.svg' } },
  { id: 'plate_tectonics', name: 'plate_tectonics', emoji: null, category: 'Geology', tags: ['system'], opts: { domain: 'earth_sciences', subdomains: ['geology'], output_type: 'system', epistemic_status: ['empirical_science'], icon: 'icon_plate_tectonics.svg' } },
  { id: 'weathering', name: 'weathering', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['geomorphology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_weathering.svg' } },
  { id: 'erosion', name: 'erosion', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['geomorphology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_erosion.svg' } },
  { id: 'sediment', name: 'sediment', emoji: null, category: 'Geology', tags: ['material'], opts: { domain: 'earth_sciences', subdomains: ['sedimentology'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_sediment.svg' } },
  { id: 'deposition', name: 'deposition', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'earth_sciences', subdomains: ['sedimentology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_deposition.svg' } },
  { id: 'rock_cycle', name: 'rock_cycle', emoji: null, category: 'Geology', tags: ['system'], opts: { domain: 'earth_sciences', subdomains: ['geology'], output_type: 'system', epistemic_status: ['empirical_science'], icon: 'icon_rock_cycle.svg' } },
  { id: 'igneous_rock', name: 'igneous_rock', emoji: null, category: 'Geology', tags: ['rock'], opts: { domain: 'earth_sciences', subdomains: ['petrology'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_igneous.svg' } },
  { id: 'sedimentary_rock', name: 'sedimentary_rock', emoji: null, category: 'Geology', tags: ['rock'], opts: { domain: 'earth_sciences', subdomains: ['petrology'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_sedimentary.svg' } },
  { id: 'metamorphic_rock', name: 'metamorphic_rock', emoji: null, category: 'Geology', tags: ['rock'], opts: { domain: 'earth_sciences', subdomains: ['petrology'], output_type: 'material', epistemic_status: ['empirical_science'], icon: 'icon_metamorphic.svg' } },
  { id: 'differentiation', name: 'differentiation', emoji: null, category: 'Geology', tags: ['process'], opts: { domain: 'space_sciences', subdomains: ['planetary_geology'], output_type: 'process', epistemic_status: ['empirical_science'], icon: 'icon_differentiation.svg' } },
]
