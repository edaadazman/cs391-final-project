import styled from 'styled-components';
import { Shooting } from '../../types';

// Props interface: array of Shooting objects
interface ShootingTableProps {
  shootings: Shooting[];
}

const TableWrapper = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.03);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 100%; 
`;

const Table = styled.table`
  width: 100%;
  table-layout: fixed; 
`;

const THead = styled.thead`
  background-color: rgba(255, 255, 255, 0.05);
`;

const TH = styled.th`
  text-align: left;
  padding: 14px 12px;
  font-weight: 600;
  color:rgb(187, 134, 252);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TR = styled.tr<{ isFatal?: boolean }>`
  background-color: ${props => props.isFatal
    ? 'rgba(207, 102, 121, 0.1)'
    : 'transparent'};
  
  &:hover {
    background-color: rgba(187, 134, 252, 0.1);
  }
`;

const TD = styled.td`
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color:rgb(224, 224, 224);
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; 
`;

const TypeTag = styled.span<{ isFatal: boolean }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => props.isFatal
    ? 'rgb(207, 102, 121)'
    : 'rgb(3, 218, 198)'};
  color:rgb(18, 18, 18);
  font-size: 0.7rem;
  font-weight: 600;
`;

// Helper to format timestamp into locale date string
const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};

// Main table component: renders the styled table with all props
export default function ShootingTable({ shootings }: ShootingTableProps) {

  return (
    <TableWrapper>
      <Table>
        <THead>
          <TR>
            {/* Column headers */}
            <TH style={{ width: '12%' }}>Incident #</TH>
            <TH style={{ width: '12%' }}>Date</TH>
            <TH style={{ width: '10%' }}>Type</TH>
            <TH style={{ width: '10%' }}>District</TH>
            <TH style={{ width: '15%' }}>Neighborhood</TH>
            <TH style={{ width: '10%' }}>Gender</TH>
            <TH style={{ width: '15%' }}>Race</TH>
            <TH style={{ width: '6%' }}>Year</TH>
            <TH style={{ width: '10%' }}>Day</TH>
          </TR>
        </THead>
        <tbody>
          {/* Maps through each incident's attributes */}
          {shootings.map(s => {
            const a = s.attributes;
            const isFatal = a.Shooting_Type_V2 === "Fatal";
            return (
              <TR key={a.OBJECTID} isFatal={isFatal}>
                <TD>{a.Incident_Num}</TD>
                <TD>{formatDate(a.Shooting_Date)}</TD>
                <TD>
                  <TypeTag isFatal={isFatal}>
                    {a.Shooting_Type_V2}
                  </TypeTag>
                </TD>
                <TD>{a.District}</TD>
                <TD>{a.NEIGHBORHOOD}</TD>
                <TD>{a.Victim_Gender}</TD>
                <TD>{a.Victim_Race}</TD>
                <TD>{a.YEAR}</TD>
                <TD>{a.DAY_OF_WEEK}</TD>
              </TR>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
