package jsone

import (
	"encoding/json"
	"io"

	jsoniter "github.com/json-iterator/go"
)

// Decoder : Reads and decodes JSON values from an input stream
type Decoder struct {
	*json.Decoder
}

// Encoder : Writes JSON values to an output stream
type Encoder struct {
	*json.Encoder
}

// NewDecoder : Returns a new decoder that reads from r
func NewDecoder(r io.Reader) *Decoder {
	return &Decoder{
		Decoder: json.NewDecoder(r),
	}
}

// NewEncoder : Returns a new encoder that writes to w
func NewEncoder(w io.Writer) *Encoder {
	return &Encoder{
		Encoder: json.NewEncoder(w),
	}
}

// Decode : Reads the next JSON-encoded value from its input and stores it in the value pointed to by v
/**
 * @param string root [Root name of JSON]
 * @param any v  [Data]
 *
 * @return error
 */
func (dec *Decoder) Decode(root string, v any) error {
	var m map[string]json.RawMessage
	err := dec.Decoder.Decode(&m)
	if err != nil {
		return err
	}

	return json.Unmarshal(m[root], v)
}

// Encode : Writes the JSON encoding of v to the stream, followed by a newline character
/**
 * @param string root [Root name of JSON]
 * @param any v  [Data]
 *
 * @return error
 */
func (enc *Encoder) Encode(root string, v any) error {
	return enc.Encoder.Encode(map[string]any{
		root: v,
	})
}

// Marshal : Go values to JSON
/**
 * @param string root [Root name of JSON]
 * @param any v  [Data]
 *
 * @return []byte
 * @return error
 */
func Marshal(root string, v any) ([]byte, error) {
	return json.Marshal(map[string]any{
		root: v,
	})
}

// MarshalIndent : Go values to JSON with indent
/**
 * @param string root [Root name of JSON]
 * @param any v [Data]
 * @param string prefix [Prefix]
 * @param string indent [Indent]
 *
 * @return []byte
 * @return error
 */
func MarshalIndent(
	root string,
	v any,
	prefix, indent string,
) ([]byte, error) {
	return json.MarshalIndent(map[string]any{
		root: v,
	}, prefix, indent)
}

// Unmarshal : JSON to Go values
/**
 * @param []byte data [JSON data]
 * @param string root [Root name of JSON]
 * @param any v [Data]
 *
 * @return error
 */
func Unmarshal(data []byte, root string, v any) error {
	var m map[string]*json.RawMessage
	err := json.Unmarshal(data, &m)
	if err != nil {
		return err
	}
	return json.Unmarshal(*m[root], v)
}

var jsonc = jsoniter.Config{TagKey: "graphql"}.Froze()

func UnmarshalGraphql(data []byte, v any) error {
	return jsonc.Unmarshal(data, v)
}

func UnmarshalOrGraphql(isGraphql bool, data []byte, v any) error {
	unmarshal := json.Unmarshal
	if isGraphql {
		unmarshal = UnmarshalGraphql
	}
	return unmarshal(data, v)
}

func MarshalGraphql(v any) ([]byte, error) {
	return jsonc.Marshal(v)
}
