import styled from 'styled-components';
import { useState } from 'react';
import { Shooting } from '../../types';

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  max-width: 320px;
  width: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  padding: 20px 16px 16px 16px;
  box-sizing: border-box;
  height: 100%;

  @media (prefers-color-scheme: dark) {
    background-color: #232323;
    border-right: 1px solid #444;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: #222;
  letter-spacing: 0.5px;
  @media (prefers-color-scheme: dark) {
    color: #e0e0e0;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 0.95rem;
  margin-bottom: 5px;
  color: #222;
  @media (prefers-color-scheme: dark) {
    color: #e0e0e0;
  }
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #222;
  @media (prefers-color-scheme: dark) {
    background: #181818;
    color: #e0e0e0;
    border: 1px solid #444;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const Checkbox = styled.input`
  margin-right: 5px;
  accent-color: #f44336;
  @media (prefers-color-scheme: dark) {
    background: #181818;
    border: 1px solid #444;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ApplyButton = styled.button`
  padding: 7px 12px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  @media (prefers-color-scheme: dark) {
    background-color: #1565c0;
    color: #fff;
  }
`;

const ClearButton = styled.button`
  padding: 7px 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  @media (prefers-color-scheme: dark) {
    background-color: #d32f2f;
    color: #fff;
  }
`;

interface FilterBarProps {
  shootings: Shooting[];
  onChange: (key: string, value: string | boolean) => void;
  onClear: () => void;
}

export default function FilterBar({ shootings, onChange, onClear }: FilterBarProps) {
  // Extract unique values for each filter from the shootings data
  const years = [...new Set(shootings.map(s => s.attributes.YEAR.toString()))].sort((a, b) => Number(b) - Number(a));
  const districts = [...new Set(shootings.map(s => s.attributes.District))].filter(Boolean).sort();
  const neighborhoods = [...new Set(shootings.map(s => s.attributes.NEIGHBORHOOD))].filter(Boolean).sort();
  const shootingTypes = [...new Set(shootings.map(s => s.attributes.Shooting_Type_V2))].filter(Boolean).sort();
  const victimGenders = [...new Set(shootings.map(s => s.attributes.Victim_Gender))].filter(Boolean).sort();
  const victimRaces = [...new Set(shootings.map(s => s.attributes.Victim_Race))].filter(Boolean).sort();

  // Local state for filters
  const [year, setYear] = useState("");
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [shootingType, setShootingType] = useState("");
  const [victimGender, setVictimGender] = useState("");
  const [victimRace, setVictimRace] = useState("");
  const [multiVictim, setMultiVictim] = useState(false);

  const handleApplyFilters = () => {
    onChange('year', year);
    onChange('district', district);
    onChange('neighborhood', neighborhood);
    onChange('shootingType', shootingType);
    onChange('victimGender', victimGender);
    onChange('victimRace', victimRace);
    onChange('multiVictim', multiVictim);
  };

  const handleClearFilters = () => {
    setYear("");
    setDistrict("");
    setNeighborhood("");
    setShootingType("");
    setVictimGender("");
    setVictimRace("");
    setMultiVictim(false);
    onClear();
  };

  return (
    <SidebarContainer>
      <SidebarTitle>Filter Incidents</SidebarTitle>
      <FilterGroup>
        <Label>Year</Label>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>District</Label>
        <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Neighborhood</Label>
        <Select value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}>
          <option value="">All Neighborhoods</option>
          {neighborhoods.map(neighborhood => (
            <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Shooting Type</Label>
        <Select value={shootingType} onChange={(e) => setShootingType(e.target.value)}>
          <option value="">All Types</option>
          {shootingTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Victim Gender</Label>
        <Select value={victimGender} onChange={(e) => setVictimGender(e.target.value)}>
          <option value="">All Genders</option>
          {victimGenders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Victim Race</Label>
        <Select value={victimRace} onChange={(e) => setVictimRace(e.target.value)}>
          <option value="">All Races</option>
          {victimRaces.map(race => (
            <option key={race} value={race}>{race}</option>
          ))}
        </Select>
      </FilterGroup>
      <FilterGroup>
        <Label>Multi-Victim</Label>
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={multiVictim}
            onChange={(e) => setMultiVictim(e.target.checked)}
          />
          <span>Multi-Victim</span>
        </CheckboxContainer>
      </FilterGroup>
      <ButtonRow>
        <ApplyButton onClick={handleApplyFilters}>Apply Filters</ApplyButton>
        <ClearButton onClick={handleClearFilters}>Clear Filters</ClearButton>
      </ButtonRow>
    </SidebarContainer>
  );
} 