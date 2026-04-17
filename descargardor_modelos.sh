#!/bin/bash

# Lista de modelos a descargar
models=(
    "devstral-small-2:24b"
    "devstral-small-2:24b-cloud"
    "devstral-2:123b-cloud"
    "devstral:24b"
    "glm-5.1:cloud"
    "minimax-m2.7:cloud"
    "gemma4:e2b"
    "gemma4:e4b"
    "gemma4:31b-cloud"
    "qwen3.5:0.8b"
    "qwen3.5:2b"
    "qwen3.5:4b"
    "qwen3.5:9b"
    "qwen3.5:27b"
    "qwen3.5:cloud"
    "qwen3.5:397b-cloud"
    "qwen3-coder-next:cloud"

)

echo "--- Iniciando descarga secuencial de modelos Ollama ---"

for model in "${models[@]}"; do
    echo "-----------------------------------------------------"
    echo "Descargando: $model..."
    start_time=$(date +%s)
    
    # Intento de descarga
    if ollama pull "$model"; then
        end_time=$(date +%s)
        duration=$((end_time - start_time))
        echo "✅ Éxito: $model descargado en $duration segundos."
    else
        echo "❌ Error: No se pudo descargar $model. Saltando al siguiente..."
    fi
done

echo "-----------------------------------------------------"
echo "¡Proceso finalizado!"