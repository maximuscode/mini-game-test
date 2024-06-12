jQuery(document).ready(function($) {
    function refreshGameResults() {
        $.ajax({
            url: refreshData.ajax_url,
            type: 'POST',
            data: {
                action: 'fetch_latest_game_results',
                nonce: refreshData.nonce
            },
            success: function(response) {
                if (response.success) {
                    $('#game-statistics').html(response.data);
                }
            }
        });
    }
  
    // game results load
    refreshGameResults();
  
    // refresh the table every 5 seconds
    setInterval(refreshGameResults, 5000);
  });
  