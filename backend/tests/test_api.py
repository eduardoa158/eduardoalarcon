def test_health(client) -> None:
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_ingest_historical_data(client) -> None:
    response = client.post('/ingest-historical-data', json={'provider': 'mock'})
    assert response.status_code == 200
    body = response.json()
    assert body['status'] == 'ok'
    assert body['provider'] == 'mock'
    assert body['ingested_matches'] == 8
    assert body['ingested_stats'] == 16
    assert body['last_synced_at'] is not None


def test_predict_match(client) -> None:
    client.post('/ingest-historical-data', json={'provider': 'mock'})
    response = client.post(
        '/predict-match',
        json={'query': 'Quiero predecir el partido entre FC Barcelona y Real Madrid en LaLiga'},
    )
    assert response.status_code == 200
    body = response.json()
    assert body['status'] == 'ok'
    assert set(body['expected_goals'].keys()) == {'home', 'away'}
    assert set(body['probabilities_1x2'].keys()) == {'home_win', 'draw', 'away_win'}
    assert len(body['top_scorelines']) >= 1
    assert 'feature_summary' in body


def test_predict_match_invalid_query(client) -> None:
    response = client.post('/predict-match', json={'query': 'Barcelona'})
    assert response.status_code == 422
    assert 'separador de equipos' in response.json()['detail']
