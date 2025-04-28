import styled from 'styled-components';
import { Shooting } from '../../types';

interface ShootingTableProps {
  shootings: Shooting[];
}

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const THead = styled.thead`
  background-color: #f5f5f5;
`;

const TH = styled.th`
  text-align: left;
  padding: 12px 8px;
  border-bottom: 2px solid #ddd;
  font-weight: 600;
  color: #333;
`;

const TR = styled.tr`
  &:nth-child(even) {
    background-color: #fafafa;
  }
  &:hover {
    background-color: gold;
  }
`;

const TD = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid #eee;
  color: #555;
`;

export default function ShootingTable({ shootings }: ShootingTableProps) {
  return (
    <TableWrapper>
      <Table>
        <THead>
          <TR>
            <TH>Incident #</TH>
            <TH>Date</TH>
            <TH>Type</TH>
            <TH>District</TH>
            <TH>Neighborhood</TH>
            <TH>Gender</TH>
            <TH>Race</TH>
            <TH>Year</TH>
            <TH>Day</TH>
            <TH>Hour</TH>
          </TR>
        </THead>
        <tbody>
          {shootings.map(s => {
            const a = s.attributes;
            return (
              <TR key={a.OBJECTID}>
                <TD>{a.Incident_Num}</TD>
                <TD>{new Date(a.Shooting_Date).toLocaleDateString()}</TD>
                <TD>{a.Shooting_Type_V2}</TD>
                <TD>{a.District}</TD>
                <TD>{a.NEIGHBORHOOD}</TD>
                <TD>{a.Victim_Gender}</TD>
                <TD>{a.Victim_Race}</TD>
                <TD>{a.YEAR}</TD>
                <TD>{a.DAY_OF_WEEK}</TD>
                <TD>{a.HOUR_OF_DAY}:00</TD>
              </TR>
            );
          })}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
