// This component was implemented by Edaad Azman
import styled from 'styled-components';
import { Shooting } from '../../types';

// accepts isFatal prop to determine card color
const PreviewCard = styled.div<{ isFatal: boolean }>`
    border: none;
    border-radius: 0.75rem;
    padding: 1.25rem;
    background-color: ${props => props.isFatal
        ? 'rgba(207, 102, 121, 0.15)'
        : 'rgba(3, 218, 198, 0.08)'};
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: rgb(224, 224, 224);
    height: 20rem;
    display: flex;
    flex-direction: column;
    
    &:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.6);
    }
`;

const IncidentTitle = styled.h3`
    color: rgb(224, 224, 224);
    margin-top: 0;
    padding-bottom: 0.75rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 0.063rem solid rgba(255, 255, 255, 0.1);
`;

const InfoSection = styled.div`
    display: grid;
    gap: 0.625rem;
    margin-top: 1rem;
    flex: 1; 
`;

const InfoItem = styled.div`
    margin: 0;
    strong {
        color: rgb(187, 134, 252);
        font-weight: 500;
        margin-right: 0.3125rem;
    }
`;

const CardFooter = styled.div`
    margin-top: auto; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 0.063rem solid rgba(255, 255, 255, 0.1);
    min-height: 2.5rem; 
`;

const MultiVictimTag = styled.div`
    background-color: rgb(207, 102, 121);
    color: rgb(18, 18, 18);
    padding: 0.25rem 0.63rem;
    border-radius: 0.25rem;
    display: inline-block;
    font-weight: 600;
    font-size: 0.8rem;
`;

// accepts isFatal prop to tag element color
const TypeTag = styled.div<{ isFatal: boolean }>`
    background-color: ${props => props.isFatal
        ? 'rgb(207, 102, 121)'
        : 'rgb(3, 218, 198)'};
    color: rgb(18, 18, 18);
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 0.25rem;
    margin-left: auto;
`;

interface ShootingPreviewProps {
    shooting: Shooting; // single shooting incident data object
}

// Function that formats the data into readable date
const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function ShootingPreview({ shooting }: ShootingPreviewProps) {
    const isFatal = shooting.attributes.Shooting_Type_V2 === "Fatal"; // for conditional styling
    const attrs = shooting.attributes;

    return (
        // Structures the card in title, info section, and footer
        <PreviewCard isFatal={isFatal}>
            <IncidentTitle>Incident #{attrs.Incident_Num}</IncidentTitle>
            <InfoSection>
                <InfoItem><strong>Date:</strong> {formatDate(attrs.Shooting_Date)}</InfoItem>
                <InfoItem><strong>Time:</strong> {attrs.HOUR_OF_DAY}:00</InfoItem>
                <InfoItem><strong>District:</strong> {attrs.District}</InfoItem>
                <InfoItem><strong>Neighborhood:</strong> {attrs.NEIGHBORHOOD}</InfoItem>
                <InfoItem><strong>Victim:</strong> {attrs.Victim_Gender}, {attrs.Victim_Race}</InfoItem>
            </InfoSection>
            <CardFooter>
                {/* conditional rendering for multiple victims and fatal / non-fatal tag */}
                {attrs.Multi_Victim === 1 ? (
                    <MultiVictimTag>Multiple Victims</MultiVictimTag>
                ) : (
                    <div></div> // empty div tag to maintain layout
                )}
                <TypeTag isFatal={isFatal}>
                    {attrs.Shooting_Type_V2}
                </TypeTag>
            </CardFooter>
        </PreviewCard>
    );
}