{{- define "retail.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "retail.labels" -}}
app.kubernetes.io/part-of: retail-platform
app.kubernetes.io/managed-by: Helm
{{- end -}}
