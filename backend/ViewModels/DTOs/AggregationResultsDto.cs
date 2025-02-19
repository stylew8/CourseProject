namespace backend.ViewModels.DTOs;

public class AggregationResultsDto
{
    public List<AggregationResultDto> AggregationResults { get; set; }
    public List<AggregationResultDto> MostFrequentAnswers { get; set; }
    public int TotalAnswers { get; set; }
}